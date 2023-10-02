import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRegularNote = async (regularNoteId: number, userId: string) => {
  const regularNote = await prisma.regularNote.findUnique({
    where: {
      id: regularNoteId,
      AND: {
        Note: {
          FolderItem: {
            userId,
          },
        },
      },
    },
    select: {
      id: true,
      canvas: true,
    },
  });

  return regularNote;
};

export const postRegularNote = async (
  label: string,
  parentFolderId: number | null,
  userId: string
) => {
  const exerciseNote = await prisma.regularNote.create({
    data: {
      Note: {
        create: {
          FolderItem: {
            create: {
              label,
              parentFolderId,
              userId,
            },
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  return exerciseNote;
};

export const putRegularNote = async (
  regularNoteId: number,
  userId: string,
  canvas: Prisma.InputJsonObject
) => {
  const problem = await prisma.regularNote.update({
    where: {
      id: regularNoteId,
      AND: {
        Note: {
          FolderItem: {
            userId,
          },
        },
      },
    },
    data: {
      canvas,
    },
    select: {
      id: true,
    },
  });

  return problem;
};
