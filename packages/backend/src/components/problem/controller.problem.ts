import { NextFunction } from "express";
import messages from "../../messages";
import {
  ProblemPostRequest,
  ProblemPostResposne,
  ProblemsDeleteByFileKeysRequest,
  ProblemsDeleteByFileKeysResposne,
  ProblemsGetRequest,
  ProblemsGetResposne,
} from "./types.problem";
import {
  deleteProblemsByFileKeys,
  getProblems,
  postProblems,
} from "./service.problem";
import CustomError from "../../utils/CustomError";
import {
  deleteCloudflareObjects,
  generateSingedGetUrl,
} from "../cloudflare/service.cloudflare";

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
  getMultiple,
  postMultiple,
  deleteMultipleByFileKeys,
};
