import { PrismaClient } from "@prisma/client";
import { Sort } from "../../globalTypes";

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
        },
        orderBy: {
          [sort.sort_by]: sort.sort_order,
        },
      },
      Note: {
        select: {
          id: true,
          label: true,
        },
        orderBy: {
          [sort.sort_by]: sort.sort_order,
        },
      },
    },
  });

  return currentFolder;
};

export const getBaseFolder = async (sort: Sort) => {
  const baseFolders = await prisma.folder.findMany({
    where: {
      parentFolderId: null,
    },
    select: {
      id: true,
      label: true,
    },
    orderBy: {
      [sort.sort_by]: sort.sort_order,
    },
  });
  const baseNotes = await prisma.note.findMany({
    where: {
      folderId: null,
    },
    select: {
      id: true,
      label: true,
    },
    orderBy: {
      [sort.sort_by]: sort.sort_order,
    },
  });

  return {
    ChildFolders: baseFolders,
    Note: baseNotes,
  };
};

export const getParentFolders = async (folderId: number) => {
  let currentFolderId = folderId;
  let parentFolders: {
    id: number;
    label: string;
  }[] = [];
  for (let i = 0; i < 3; i++) {
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

    if (i !== 0) {
      parentFolders.push(currentFolderData);
    }

    if (!currentFolder.ParentFolder) break;
    currentFolderId = currentFolder.ParentFolder.id;
  }

  return parentFolders;
};

export const postFolder = async (
  label: string,
  parentFolderId: number | null
) => {
  const folder = await prisma.folder.create({
    data: {
      label: label,
      parentFolderId: parentFolderId,
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
      id: id,
    },
    data: {
      label: label,
      parentFolderId: parentFolderId,
    },
  });

  return folder;
};

export const deleteFolder = async (id: number) => {
  const folder = await prisma.folder.delete({
    where: {
      id: id,
    },
  });

  return folder;
};
