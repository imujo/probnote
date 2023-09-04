import { PrismaClient } from "@prisma/client";
import { Sort } from "../../globalTypes";
import { FolderPutBody } from "./types.folder";

const prisma = new PrismaClient();

export const getPinnedFolders = async (userId: string, sort: Sort) => {
  const pinnedFolders = await prisma.folder.findMany({
    where: {
      pinned: true,
      FolderItem: {
        userId,
      },
    },
    select: {
      id: true,
      FolderItem: {
        select: {
          id: true,
          label: true,
        },
      },
    },
    orderBy: {
      [sort.sortBy]: sort.sortOrder, // can only be datePinned
    },
  });

  return pinnedFolders;
};

export const getParentFolders = async (folderId: number, userId: string) => {
  const MAX = 3;
  let currentFolderId = folderId;
  const parentFolders: {
    folderId: number;
    label: string;
  }[] = [];
  let moreParentsExist = false;

  for (let i = 0; i < MAX; i++) {
    const currentFolder = await prisma.folder.findFirst({
      where: {
        id: currentFolderId,
        FolderItem: {
          userId,
        },
      },
      select: {
        id: true,
        FolderItem: {
          select: {
            label: true,
            ParentFolder: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!currentFolder) break;

    const currentFolderData = {
      folderId: currentFolder.id,
      label: currentFolder.FolderItem.label,
    };

    parentFolders.push(currentFolderData);
    if (!currentFolder.FolderItem.ParentFolder) break;
    currentFolderId = currentFolder.FolderItem.ParentFolder.id;

    if (i === MAX - 1) moreParentsExist = true;
  }

  if (parentFolders.length === 0) {
    return null;
  }

  return {
    parentFolders,
    more: moreParentsExist,
  };
};

export const postFolder = async (
  label: string,
  parentFolderId: number | null,
  userId: string
) => {
  const folder = await prisma.folderItem.create({
    data: {
      label,
      userId,
      parentFolderId,
      Folder: {
        create: {
          pinned: false,
          datePinned: new Date(),
        },
      },
    },
    select: {
      id: true,
      Folder: {
        select: {
          id: true,
        },
      },
    },
  });
  return folder;
};

export const putFolder = async (
  folderId: number,
  body: FolderPutBody,
  userId: string
) => {
  const pinStatusChanged = body.pinned !== undefined;

  const folder = await prisma.folder.update({
    where: {
      id: folderId,
      FolderItem: {
        userId,
      },
    },
    data: {
      pinned: body.pinned,
      datePinned: pinStatusChanged ? new Date() : undefined,
    },
  });

  return folder;
};
