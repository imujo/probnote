import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProblems = async (exerciseNoteId: number, userId: string) => {
  const problems = await prisma.problem.findMany({
    where: {
      exerciseNoteId,
      AND: {
        ExerciseNote: {
          Note: {
            FolderItem: {
              userId,
            },
          },
        },
      },
    },
    select: {
      id: true,
      problemFileKey: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return problems;
};

export const postProblems = async (
  fileKeys: string[],
  exerciseNoteId: number
) => {
  const problems = await prisma.problem.createMany({
    data: fileKeys.map((fileKey) => ({
      exerciseNoteId,
      problemFileKey: fileKey,
    })),
  });

  return problems;
};

export const deleteProblemsByFileKeys = async (
  fileKeys: string[],
  userId: string
) => {
  const problems = await prisma.problem.deleteMany({
    where: {
      problemFileKey: {
        in: fileKeys,
      },
      AND: {
        ExerciseNote: {
          Note: {
            FolderItem: {
              userId,
            },
          },
        },
      },
    },
  });

  return problems;
};
