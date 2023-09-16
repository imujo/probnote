import { NextFunction } from "express";
import messages from "../../messages";
import {
  ProblemGetRequest,
  ProblemGetResposne,
  ProblemPostRequest,
  ProblemPostResposne,
  ProblemPutRequest,
  ProblemPutResposne,
  ProblemsDeleteByFileKeysRequest,
  ProblemsDeleteByFileKeysResposne,
  ProblemsGetRequest,
  ProblemsGetResposne,
} from "./types.problem";
import {
  deleteProblemsByFileKeys,
  getProblem,
  getProblems,
  postProblems,
  putProblem,
} from "./service.problem";
import CustomError from "../../utils/CustomError";
import {
  deleteCloudflareObjects,
  generateSingedGetUrl,
} from "../cloudflare/service.cloudflare";
import { Prisma } from "@prisma/client";

const get = async (
  req: ProblemGetRequest,
  res: ProblemGetResposne,
  next: NextFunction
) => {
  try {
    const problemId = parseInt(req.params.problemId);
    const { userId } = req.auth;

    const problem = await getProblem(problemId, userId);

    if (!problem) throw new CustomError(messages.notFound("Problem"), 404);

    const url = await generateSingedGetUrl(problem.problemFileKey).catch(() => {
      throw new CustomError("Could not generate signed URL", 500);
    });

    res.status(200).json({
      message: messages.getSuccess("Problem"),
      data: {
        id: problem.id,
        canvas: problem.canvas,
        url,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMultiple = async (
  req: ProblemsGetRequest,
  res: ProblemsGetResposne,
  next: NextFunction
) => {
  try {
    const exerciseNoteId = parseInt(req.params.exerciseNoteId);
    const { userId } = req.auth;

    const problems = await getProblems(exerciseNoteId, userId);

    const problemsWithGetUrls = await Promise.all(
      problems.map(async (problem) => {
        const url = await generateSingedGetUrl(problem.problemFileKey);

        return {
          id: problem.id,
          url,
          edited: problem.createdAt.getTime() !== problem.updatedAt.getTime(),
        };
      })
    ).catch(() => {
      throw new CustomError("Could not generate signed URLs", 500);
    });

    res.status(200).json({
      message: messages.getSuccess("Problems"),
      data: {
        problems: problemsWithGetUrls,
      },
    });
  } catch (error) {
    next(error);
  }
};

const postMultiple = async (
  req: ProblemPostRequest,
  res: ProblemPostResposne,
  next: NextFunction
) => {
  try {
    const { exerciseNoteId, fileKeys } = req.body;

    const problems = await postProblems(fileKeys, exerciseNoteId);

    res.status(200).json({
      message: messages.postSuccess("Problems"),
      data: {
        count: problems.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

const put = async (
  req: ProblemPutRequest,
  res: ProblemPutResposne,
  next: NextFunction
) => {
  try {
    const { canvas } = req.body;
    const problemId = parseInt(req.params.problemId);
    const { userId } = req.auth;

    const problem = await putProblem(
      problemId,
      userId,
      canvas as Prisma.InputJsonObject
    );

    res.status(200).json({
      message: messages.putSuccess("Problem", problem.id),
      data: {
        id: problem.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteMultipleByFileKeys = async (
  req: ProblemsDeleteByFileKeysRequest,
  res: ProblemsDeleteByFileKeysResposne,
  next: NextFunction
) => {
  try {
    const { fileKeys } = req.body;
    const { userId } = req.auth;

    const problems = await deleteProblemsByFileKeys(fileKeys, userId);

    const cloudflareResponse = await deleteCloudflareObjects(fileKeys);

    if (cloudflareResponse.Errors !== undefined)
      throw new CustomError("Could note delete all files from Cloudflare", 500);

    res.status(200).json({
      message: messages.deleteMultipleSuccess("Problems", problems.count),
      data: {
        count: problems.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  get,
  getMultiple,
  postMultiple,
  put,
  deleteMultipleByFileKeys,
};
