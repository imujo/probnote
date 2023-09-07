import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
