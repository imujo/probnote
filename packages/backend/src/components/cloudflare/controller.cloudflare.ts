import { NextFunction } from "express";
import messages from "../../messages";
import CustomError from "../../utils/CustomError";
import {
  CloudflareDeleteObjectsRequest,
  CloudflareGetUploadUrlsRequest,
  CloudflareGetUploadUrlsResposne,
} from "./types.cloudflare";
import {
  deleteCloudflareObjects,
  generateMultipleSignedUploadUrls,
} from "./service.cloudflare";

const getUploadUrls = async (
  req: CloudflareGetUploadUrlsRequest,
  res: CloudflareGetUploadUrlsResposne,
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

const deleteObjects = async (
  req: CloudflareDeleteObjectsRequest,
  res: CloudflareGetUploadUrlsResposne,
  next: NextFunction
) => {
  try {
    const { filekeys } = req.body;

    const response = await deleteCloudflareObjects(filekeys);

    if (response.Errors !== undefined)
      throw new CustomError("Could note delete all files from Cloudflare", 500);

    res.status(200).json({
      message: messages.deleteMultipleSuccess(
        "Cloudflare objects",
        response.Deleted?.length || 0
      ),
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUploadUrls,
  deleteObjects,
};
