import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const postExerciseNote = async (
  label: string,
  parentFolderId: number | null,
  userId: string
) => {
  const exerciseNote = await prisma.exerciseNote.create({
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
