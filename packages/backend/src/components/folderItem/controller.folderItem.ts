import { NextFunction } from "express";
import { Sort } from "../../globalTypes";
import messages from "../../messages";
import CustomError from "../../utils/CustomError";
import {
  deleteFolderItem,
  getFolderItems,
  putFolderItem,
} from "./service.folderItem";
import {
  FolderItemDeleteRequest,
  FolderItemDeleteResposne,
  FolderItemsGetRequest,
  FolderItemsGetResponse,
  FolderItemPutRequest,
  FolderItemPutResposne,
} from "./types.folderItem";

const get = async (
  req: FolderItemsGetRequest,
  res: FolderItemsGetResponse,
  next: NextFunction
) => {
  try {
    const parentFolderId = parseInt(req.params.parentFolderId, 10) || null;
    const { sortBy, sortOrder } = req.query;
    const sort: Sort = {
      sortBy,
      sortOrder,
    };

    const folderItems = await getFolderItems(parentFolderId, sort);

    if (!folderItems) {
      const message = parentFolderId
        ? messages.notFoundWithId("Items from folder", parentFolderId)
        : messages.notFound("Base folder items");

      throw new CustomError(message, 404);
    }

    res.status(200).json({
      message: messages.getSuccess("Folder items"),
      data: folderItems,
    });
  } catch (error) {
    next(error);
  }
};

const put = async (
  req: FolderItemPutRequest,
  res: FolderItemPutResposne,
  next: NextFunction
) => {
  try {
    const folderItemId = parseInt(req.params.folderItemId, 10);
    const body = req.body;

    const folderItem = await putFolderItem(folderItemId, body);

    res.status(200).json({
      message: messages.putSuccess("Folder item", folderItemId),
      data: {
        folderItemId: folderItem.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const del = async (
  req: FolderItemDeleteRequest,
  res: FolderItemDeleteResposne,
  next: NextFunction
) => {
  try {
    const folderItemId = parseInt(req.params.folderItemId, 10);

    const folderItem = await deleteFolderItem(folderItemId);

    res.status(200).json({
      message: messages.deleteSuccess("Folder item", folderItemId),
      data: {
        folderItemId: folderItem.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  get,
  put,
  del,
};
