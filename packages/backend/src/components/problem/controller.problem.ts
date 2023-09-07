import { NextFunction } from "express";
import messages from "../../messages";
import {
  ProblemPostRequest,
  ProblemPostResposne,
  ProblemsDeleteByFileKeysRequest,
  ProblemsDeleteByFileKeysResposne,
} from "./types.problem";
import { deleteProblemsByFileKeys, postProblems } from "./service.problem";
import CustomError from "../../utils/CustomError";
import { deleteCloudflareObjects } from "../cloudflare/service.cloudflare";

const postMultiple = async (
  req: ProblemPostRequest,
  res: ProblemPostResposne,
  next: NextFunction
) => {
  try {
    const { exerciseNoteId, problemFileKeys } = req.body;

    const problems = await postProblems(problemFileKeys, exerciseNoteId);

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
    const { problemFileKeys } = req.body;
    const { userId } = req.auth;

    const problems = await deleteProblemsByFileKeys(problemFileKeys, userId);

    const cloudflareResponse = await deleteCloudflareObjects(problemFileKeys);

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
  postMultiple,
  deleteMultipleByFileKeys,
};