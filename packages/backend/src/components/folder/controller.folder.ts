import { NextFunction } from "express";
import {
  getFolder,
  getParentFolders,
  postFolder,
  putFolder,
} from "./service.folder";
import {
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

const get = async (
  req: FolderGetRequest,
  res: FolderGetResposne,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    const folder = await getFolder(id);

    if (!folder) {
      throw new Error(messages.notFoundWithId("Folder", id));
    }

    const parentFolders = await getParentFolders(id);

    res.status(200).json({
      message: messages.getSuccess("Folder"),
      data: {
        ...folder,
        parentFolders: parentFolders,
      },
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

export default {
  get,
  getParents,
  post,
  put,
};
