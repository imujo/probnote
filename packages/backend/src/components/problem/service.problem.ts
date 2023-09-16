import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProblem = async (problemId: number, userId: string) => {
  const problems = await prisma.problem.findUnique({
    where: {
      id: problemId,
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
      canvas: true,
      ExerciseNote: {
        select: {
          Note: {
            select: {
              FolderItem: {
                select: {
                  parentFolderId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return problems;
};

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
    orderBy: {
      id: "asc",
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

export const putProblem = async (
  problemId: number,
  userId: string,
  canvas: Prisma.InputJsonObject
) => {
  const problem = await prisma.problem.update({
    where: {
      id: problemId,
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
    data: {
      canvas,
    },
    select: {
      id: true,
    },
  });

  return problem;
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
