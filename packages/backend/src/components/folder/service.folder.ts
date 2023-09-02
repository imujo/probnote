import { PrismaClient } from "@prisma/client";
import { Sort } from "../../globalTypes";
import { FolderPutBody } from "./types.folder";

const prisma = new PrismaClient();

export const getPinnedFolders = async (sort: Sort) => {
  const pinnedFolders = await prisma.folder.findMany({
    where: {
      pinned: true,
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

export const getParentFolders = async (folderId: number) => {
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
    parentFolders: parentFolders,
    more: moreParentsExist,
  };
};

export const postFolder = async (
  label: string,
  parentFolderId: number | null
) => {
  const folder = await prisma.folderItem.create({
    data: {
      label,
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

export const putFolder = async (folderId: number, body: FolderPutBody) => {
  const pinStatusChanged = body.pinned !== undefined;

  const folder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      pinned: body.pinned,
      datePinned: pinStatusChanged ? new Date() : undefined,
    },
  });

  return folder;
};
