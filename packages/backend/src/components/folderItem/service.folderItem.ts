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
        Note: {
          ExerciseNote: {
            id: number;
          } | null;
          RegularNote: {
            id: number;
          } | null;
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
        Note: {
          select: {
            ExerciseNote: {
              select: {
                id: true,
              },
            },
            RegularNote: {
              select: {
                id: true,
              },
            },
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
            Note: {
              select: {
                ExerciseNote: {
                  select: {
                    id: true,
                  },
                },
                RegularNote: {
                  select: {
                    id: true,
                  },
                },
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
    select: {
      id: true,
      Folder: {
        select: {
          Children: {
            select: {
              Note: {
                select: {
                  ExerciseNote: {
                    select: {
                      Problem: {
                        select: {
                          problemFileKey: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      Note: {
        select: {
          ExerciseNote: {
            select: {
              Problem: {
                select: {
                  problemFileKey: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return folderItem;
};

export const searchFolderItem = async (query: string, userId: string) => {
  const folderItems = prisma.folderItem.findMany({
    where: {
      label: {
        contains: query,
        mode: "insensitive",
      },
      userId: userId,
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
      Note: {
        select: {
          ExerciseNote: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    take: 5,
  });

  return folderItems;
};
