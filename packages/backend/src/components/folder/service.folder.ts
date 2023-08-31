import { Prisma, PrismaClient } from "@prisma/client";
import { Sort } from "../../globalTypes";
import { string } from "zod";

const prisma = new PrismaClient();

export const getFolder = async (folderId: number, sort: Sort) => {
  const currentFolder = await prisma.folder.findFirst({
    where: {
      id: folderId,
    },
    include: {
      ChildFolders: {
        select: {
          id: true,
          label: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [sort.sortBy]: sort.sortOrder,
        },
      },
      Note: {
        select: {
          id: true,
          label: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [sort.sortBy]: sort.sortOrder,
        },
      },
    },
  });

  return currentFolder;
};

export const getFolderChildren = async (folderId: number, sort: Sort) => {
  const children = await prisma.folder.findFirst({
    where: {
      id: folderId,
    },
    select: {
      ChildFolders: {
        select: {
          id: true,
          label: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [sort.sortBy]: sort.sortOrder,
        },
      },
      Note: {
        select: {
          id: true,
          label: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [sort.sortBy]: sort.sortOrder,
        },
      },
    },
  });

  return children;
};

export const getBaseFolderChildren = async (sort: Sort) => {
  const baseFolders = await prisma.folder.findMany({
    where: {
      parentFolderId: null,
    },
    select: {
      id: true,
      label: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      [sort.sortBy]: sort.sortOrder,
    },
  });
  const baseNotes = await prisma.note.findMany({
    where: {
      folderId: null,
    },
    select: {
      id: true,
      label: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      [sort.sortBy]: sort.sortOrder,
    },
  });

  return {
    ChildFolders: baseFolders,
    Note: baseNotes,
  };
};

export const getParentFolders = async (folderId: number) => {
  const MAX = 3;
  let currentFolderId = folderId;
  const parentFolders: {
    id: number;
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
        label: true,
        ParentFolder: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!currentFolder) break;

    const currentFolderData = {
      id: currentFolder.id,
      label: currentFolder.label,
    };

    parentFolders.push(currentFolderData);
    if (!currentFolder.ParentFolder) break;
    currentFolderId = currentFolder.ParentFolder.id;

    if (i === MAX - 1) moreParentsExist = true;
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
  const folder = await prisma.folder.create({
    data: {
      label,
      parentFolderId,
    },
  });

  return folder;
};

export const putFolder = async (
  id: number,
  label?: string,
  parentFolderId?: number | null
) => {
  const folder = await prisma.folder.update({
    where: {
      id,
    },
    data: {
      label,
      parentFolderId,
    },
  });

  return folder;
};

export const deleteFolder = async (id: number) => {
  const folder = await prisma.folder.delete({
    where: {
      id,
    },
  });

  return folder;
};
