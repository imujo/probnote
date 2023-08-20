import { NextFunction } from "express";
import { getFolder, getParentFolders } from "./service.folder";
import { FolderGetRequest, FolderGetResposne } from "./types.folder";

const get = async (
  req: FolderGetRequest,
  res: FolderGetResposne,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    const folder = await getFolder(id);

    if (!folder) {
      throw new Error(`Not Found: Folder with id ${id} not found`);
    }

    const parentFolders = await getParentFolders(id);

    res.status(200).json({
      message: "Folder retrieved successfully",
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

export default {
  get,
};
