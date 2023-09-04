import { PrismaClient } from "@prisma/client";
import { Sort } from "../../globalTypes";
import { FolderItemPutBody } from "./types.folderItem";

const prisma = new PrismaClient();

export const getFolderItems = async (
  parentFolderId: number | null,
  userId: string,
  sort: Sort
) => {
  let folderItems:
    | {
        id: number;
        label: string;
        createdAt: Date;
        updatedAt: Date;
        Folder: {
          id: number;
          pinned: boolean;
        } | null;
      }[]
    | null;
  if (parentFolderId === null) {
    folderItems = await prisma.folderItem.findMany({
      where: {
        parentFolderId,
        userId,
      },
      select: {
        id: true,
        label: true,
        createdAt: true,
        updatedAt: true,
        Folder: {
          select: {
            id: true,
            pinned: true,
          },
        },
      },
      orderBy: {
        [sort.sortBy]: sort.sortOrder,
      },
    });
  } else {
    const temp = await prisma.folder.findFirst({
      where: {
        id: parentFolderId,
        FolderItem: {
          userId,
        },
      },
      select: {
        Children: {
          select: {
            id: true,
            label: true,
            createdAt: true,
            updatedAt: true,
            Folder: {
              select: {
                id: true,
                pinned: true,
              },
            },
          },
        },
      },
    });

    folderItems = temp?.Children || null;
  }

  return folderItems;
};

export const putFolderItem = async (
  folderItemId: number,
  body: FolderItemPutBody,
  userId: string
) => {
  const folderItem = await prisma.folderItem.update({
    where: {
      id: folderItemId,
      userId,
    },
    data: body,
  });

  return folderItem;
};

export const deleteFolderItem = async (
  folderItemId: number,
  userId: string
) => {
  const folderItem = await prisma.folderItem.delete({
    where: {
      id: folderItemId,
      userId,
    },
  });

  return folderItem;
};
