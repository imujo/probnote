import { NextFunction } from "express";
import {
  getParentFolders,
  postFolder,
  putFolder,
  getPinnedFolders,
} from "./service.folder";
import {
  FolderGetParentsRequest,
  FolderGetParentsResposne,
  FolderPostRequest,
  FolderPostResposne,
  FolderPutRequest,
  FolderPutResposne,
  FolderGetPinnedRequest,
  FolderGetPinnedResponse,
} from "./types.folder";
import messages from "../../messages";
import { Sort } from "../../globalTypes";
import CustomError from "../../utils/CustomError";

const getPinned = async (
  req: FolderGetPinnedRequest,
  res: FolderGetPinnedResponse,
  next: NextFunction
) => {
  try {
    const { sortBy, sortOrder } = req.query;
    const sort: Sort = {
      sortBy,
      sortOrder,
    };

    const pinnedFoldersData = await getPinnedFolders(sort);
    const pinnedFolders = pinnedFoldersData.map((pinnedFolderData) => {
      return {
        folderItemId: pinnedFolderData.FolderItem.id,
        folderId: pinnedFolderData.id,
        label: pinnedFolderData.FolderItem.label,
      };
    });

    if (!pinnedFolders) {
      throw new CustomError(messages.notFound("Pinned folders"), 404);
    }

    res.status(200).json({
      message: messages.getSuccess("Pinned folders"),
      data: pinnedFolders,
    });
  } catch (error) {
    next(error);
  }
};

const getParents = async (
  req: FolderGetParentsRequest,
  res: FolderGetParentsResposne,
  next: NextFunction
) => {
  try {
    const folderId = parseInt(req.params.folderId, 10);

    const parentFolders = await getParentFolders(folderId);

    if (!parentFolders) {
      throw new CustomError(
        messages.notFoundWithId("Items from folder", folderId),
        404
      );
    }

    res.status(200).json({
      message: messages.getSuccess("Folder parents"),
      data: parentFolders,
    });
  } catch (error) {
    next(error);
  }
};

const post = async (
  req: FolderPostRequest,
  res: FolderPostResposne,
  next: NextFunction
) => {
  try {
    const { label, parentFolderId } = req.body;

    const folder = await postFolder(label, parentFolderId);

    if (folder.Folder === null) {
      throw new CustomError(
        `Folder item with id ${folder.id} does not have a folder`,
        500
      );
    }

    res.status(200).json({
      message: messages.postSuccess("Folder"),
      data: {
        folderId: folder.Folder.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const put = async (
  req: FolderPutRequest,
  res: FolderPutResposne,
  next: NextFunction
) => {
  try {
    const folderId = parseInt(req.params.folderId, 10);
    const body = req.body;

    const folder = await putFolder(folderId, body);

    res.status(200).json({
      message: messages.putSuccess("Folder", folderId),
      data: {
        folderId: folder.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getParents,
  post,
  put,
  getPinned,
};
