import { NextFunction } from "express";
import { Sort } from "../../globalTypes";
import messages from "../../messages";
import CustomError from "../../utils/CustomError";
import {
  deleteFolderItem,
  getFolderItems,
  putFolderItem,
  searchFolderItem,
} from "./service.folderItem";
import {
  FolderItemDeleteRequest,
  FolderItemDeleteResposne,
  FolderItemsGetRequest,
  FolderItemsGetResponse,
  FolderItemPutRequest,
  FolderItemPutResposne,
  FolderItemsSearchRequest,
  FolderItemsSearchResponse,
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
    const { userId } = req.auth;

    const folderItems = await getFolderItems(parentFolderId, userId, sort);

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

const getSearch = async (
  req: FolderItemsSearchRequest,
  res: FolderItemsSearchResponse,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;

    const folderItems = await searchFolderItem(req.query.query, userId);

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
    const { userId } = req.auth;

    const { id } = await putFolderItem(folderItemId, body, userId);

    res.status(200).json({
      message: messages.putSuccess("Folder item", id),
      data: {
        folderItemId: id,
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
    const { userId } = req.auth;

    const folderItem = await deleteFolderItem(folderItemId, userId);

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
  getSearch,
  put,
  del,
};
