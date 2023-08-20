import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getFolder = async (folderId: number) => {
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
      },
      Note: {
        select: {
          id: true,
          label: true,
        },
      },
    },
  });

  return currentFolder;
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
