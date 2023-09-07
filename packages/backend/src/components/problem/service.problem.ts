import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const postProblems = async (
  problemFileKeys: string[],
  exerciseNoteId: number
) => {
  const problems = await prisma.problem.createMany({
    data: problemFileKeys.map((problemFileKey) => ({
      exerciseNoteId,
      problemFileKey: problemFileKey,
    })),
  });

  return problems;
};

export const deleteProblemsByFileKeys = async (
  problemFileKeys: string[],
  userId: string
) => {
  const problems = await prisma.problem.deleteMany({
    where: {
      problemFileKey: {
        in: problemFileKeys,
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
