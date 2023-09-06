import { NextFunction } from "express";
import messages from "../../messages";
import {
  ProblemGetUploadUrlsRequest,
  ProblemGetUploadUrlsResposne,
  ProblemPostRequest,
  ProblemPostResposne,
  CloudflareObjectsDeleteRequest,
  CloudflareObjectsDeleteResposne,
} from "./types.problem";
import { postProblems } from "./service.problem";
import {
  deleteCloudflareObjects,
  generateMultipleSignedUploadUrls,
} from "../../utils/upload";
import CustomError from "../../utils/CustomError";

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

const getUploadUrls = async (
  req: ProblemGetUploadUrlsRequest,
  res: ProblemGetUploadUrlsResposne,
  next: NextFunction
) => {
  try {
    const { filenames } = req.body;

    const problemsSignedUrls =
      await generateMultipleSignedUploadUrls(filenames);

    if (!problemsSignedUrls) {
      throw new CustomError("Could not generate signed upload URLs", 500);
    }

    res.status(200).json({
      message: messages.getSuccess("Signed upload URLs"),
      data: problemsSignedUrls,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCloudflareObject = async (
  req: CloudflareObjectsDeleteRequest,
  res: CloudflareObjectsDeleteResposne,
  next: NextFunction
) => {
  try {
    const { filekeys } = req.body;

    const response = await deleteCloudflareObjects(filekeys);

    if (response.Errors !== undefined)
      throw new CustomError("Could note delete all files from Cloudflare", 500);

    res.status(200).json({
      message: messages.getSuccess("Signed upload URLs"),
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export default {
  postMultiple,
  getUploadUrls,
  deleteCloudflareObject,
};
