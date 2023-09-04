import { PrismaClient } from "@prisma/client";
import { Sort } from "../../globalTypes";
import { FolderItemPutBody } from "./types.folderItem";

const prisma = new PrismaClient();

export const getFolderItems = async (
  parentFolderId: number | null,
  userId: string,
  sort: Sort
) => {
  const folderItems = await prisma.folderItem.findMany({
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
