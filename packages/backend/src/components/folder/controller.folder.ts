import { NextFunction } from "express";
import {
  deleteFolder,
  getFolderChildren,
  getFolder,
  getParentFolders,
  postFolder,
  putFolder,
  getBaseFolderChildren,
} from "./service.folder";
import {
  FolderDeleteRequest,
  FolderDeleteResposne,
  FolderGetParentsRequest,
  FolderGetParentsResposne,
  FolderGetRequest,
  FolderPostRequest,
  FolderPostResposne,
  FolderPutRequest,
  FolderPutResposne,
  FolderGetResponse,
  FolderGetBaseChildrenRequest,
  FolderGetChildrenResponse,
  FolderGetChildrenRequest,
} from "./types.folder";
import messages from "../../messages";
import { Sort } from "../../globalTypes";
import CustomError from "../../utils/CustomError";

const get = async (
  req: FolderGetRequest,
  res: FolderGetResponse,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { sortBy, sortOrder } = req.query;
    const sort: Sort = {
      sortBy,
      sortOrder,
    };

    const folder = await getFolder(id, sort);

    if (!folder) {
      throw new CustomError(messages.notFoundWithId("Folder", id), 404);
    }

    res.status(200).json({
      message: messages.getSuccess("Folder"),
      data: folder,
    });
  } catch (error) {
    //
    next(error);
  }
};

const getChildren = async (
  req: FolderGetChildrenRequest,
  res: FolderGetChildrenResponse,
  next: NextFunction
) => {
  try {
    if (req.params.id === "base") {
    }

    const id = parseInt(req.params.id, 10);
    const { sortBy, sortOrder } = req.query;
    const sort: Sort = {
      sortBy,
      sortOrder,
    };

    const children = await getFolderChildren(id, sort);

    if (!children) {
      throw new CustomError(messages.notFoundWithId("Folder", id), 404);
    }

    res.status(200).json({
      message: messages.getSuccess("Folder"),
      data: children,
    });
  } catch (error) {
    next(error);
  }
};

const getBaseChildren = async (
  req: FolderGetBaseChildrenRequest,
  res: FolderGetChildrenResponse,
  next: NextFunction
) => {
  try {
    const { sortBy, sortOrder } = req.query;
    const sort: Sort = {
      sortBy,
      sortOrder,
    };

    const children = await getBaseFolderChildren(sort);

    res.status(200).json({
      message: messages.getSuccess("Base folder children"),
      data: children,
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
    const id = parseInt(req.params.id, 10);

    const data = await getParentFolders(id);

    res.status(200).json({
      message: messages.getSuccess("Folder parents"),
      data: data,
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

    res.status(200).json({
      message: messages.postSuccess("Folder"),
      data: {
        id: folder.id,
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
    const id = parseInt(req.params.id, 10);
    const { label, parentFolderId } = req.body;

    const folder = await putFolder(id, label, parentFolderId);

    res.status(200).json({
      message: messages.putSuccess("Folder"),
      data: {
        id: folder.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const del = async (
  req: FolderDeleteRequest,
  res: FolderDeleteResposne,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id, 10);

    const folder = await deleteFolder(id);

    res.status(200).json({
      message: messages.deleteSuccess("Folder"),
      data: {
        id: folder.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  get,
  getChildren,
  getBaseChildren,
  getParents,
  post,
  put,
  del,
};
