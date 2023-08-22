import { NextFunction } from "express";
import {
  deleteFolder,
  getBaseFolder,
  getFolder,
  getParentFolders,
  postFolder,
  putFolder,
} from "./service.folder";
import {
  FolderDeleteRequest,
  FolderDeleteResposne,
  FolderGetBaseRequest,
  FolderGetBaseResposne,
  FolderGetParentsRequest,
  FolderGetParentsResposne,
  FolderGetRequest,
  FolderGetResposne,
  FolderPostRequest,
  FolderPostResposne,
  FolderPutRequest,
  FolderPutResposne,
} from "./types.folder";
import messages from "../../messages";
import { Sort } from "../../globalTypes";
import { CustomError } from "../../utils/CustomError";

const get = async (
  req: FolderGetRequest,
  res: FolderGetResposne,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const { sort_by, sort_order } = req.query;
    const sort: Sort = {
      sort_by: sort_by,
      sort_order: sort_order,
    };

    const folder = await getFolder(id, sort);

    if (!folder) {
      throw new CustomError(messages.notFoundWithId("Folder", id), 404);
    }

    res.status(200).json({
      message: messages.getSuccess("Folder"),
      data: folder,
      error: false,
    });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const getBase = async (
  req: FolderGetBaseRequest,
  res: FolderGetBaseResposne,
  next: NextFunction
) => {
  try {
    const { sort_by, sort_order } = req.query;
    const sort: Sort = {
      sort_by: sort_by,
      sort_order: sort_order,
    };

    const children = await getBaseFolder(sort);

    res.status(200).json({
      message: messages.getSuccess("Base folder"),
      data: children,
      error: false,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getParents = async (
  req: FolderGetParentsRequest,
  res: FolderGetParentsResposne,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    const parentFolders = await getParentFolders(id);

    res.status(200).json({
      message: messages.getSuccess("Folder parents"),
      data: parentFolders,
      error: false,
    });
  } catch (error) {
    console.log(error);
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

    res.status(200).json({
      message: messages.postSuccess("Folder"),
      error: false,
      data: {
        id: folder.id,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const put = async (
  req: FolderPutRequest,
  res: FolderPutResposne,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const { label, parentFolderId } = req.body;

    const folder = await putFolder(id, label, parentFolderId);

    res.status(200).json({
      message: messages.putSuccess("Folder"),
      error: false,
      data: {
        id: folder.id,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const del = async (
  req: FolderDeleteRequest,
  res: FolderDeleteResposne,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    const folder = await deleteFolder(id);

    res.status(200).json({
      message: messages.deleteSuccess("Folder"),
      data: {
        id: folder.id,
      },
      error: false,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default {
  get,
  getBase,
  getParents,
  post,
  put,
  del,
};
