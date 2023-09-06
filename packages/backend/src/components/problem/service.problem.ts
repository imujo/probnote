import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const postProblems = async (
  problemFileKeys: string[],
  exerciseNoteId: number
) => {
  const exerciseNote = await prisma.problem.createMany({
    data: problemFileKeys.map((problemFileKey) => ({
      exerciseNoteId,
      problemFileKey: problemFileKey,
    })),
  });

  return exerciseNote;
};
