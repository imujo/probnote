import { z } from "zod";
import { Response } from "express";
import { AuthRequestBuilder } from "../../utils/requestResponseBuilders";
import { SuccessResponse } from "../../globalTypes";
import messages from "../../messages";
import { SignedUploadUrl } from "../../utils/upload";

// POST PROBLEMS

export const problemsPostSchema = {
  body: z.object({
    problemFileKeys: z.array(
      z.string({
        invalid_type_error: messages.invalidType("ProblemFileKey", "string"),
        required_error: messages.required("ProblemFileKey"),
      })
    ),
    exerciseNoteId: z.number({
      invalid_type_error: messages.invalidType("ExerciseNoteId", "number"),
      required_error: messages.required("ExerciseNoteId"),
    }),
  }),
};

const problemsPostBuilder = new AuthRequestBuilder(problemsPostSchema);
export type ProblemPostRequest = ReturnType<
  typeof problemsPostBuilder.getRequestType
>;
export type ProblemPost = SuccessResponse<{
  count: number;
}>;
export type ProblemPostResposne = Response<ProblemPost>;

// DELETE PROBLEMS BY FILEKEYS

export const problemsDeleteByFileKeysSchema = {
  body: z.object({
    problemFileKeys: z.array(
      z.string({
        invalid_type_error: messages.invalidType("ProblemFileKey", "string"),
        required_error: messages.required("ProblemFileKey"),
      })
    ),
  }),
};

const problemsDeleteByFileKeysBuilder = new AuthRequestBuilder(
  problemsDeleteByFileKeysSchema
);
export type ProblemsDeleteByFileKeysRequest = ReturnType<
  typeof problemsDeleteByFileKeysBuilder.getRequestType
>;
export type ProblemsDeleteByFileKeys = SuccessResponse<{
  count: number;
}>;
export type ProblemsDeleteByFileKeysResposne =
  Response<ProblemsDeleteByFileKeys>;

// GET PROBLEM UPLOAD URLS

export const problemGetUploadUrlsSchema = {
  body: z.object({
    filenames: z.array(
      z.string({
        invalid_type_error: messages.invalidType("ProblemFileKey", "string"),
        required_error: messages.required("ProblemFileKey"),
      })
    ),
  }),
};

const problemGetUploadUrlsBuilder = new AuthRequestBuilder(
  problemGetUploadUrlsSchema
);
export type ProblemGetUploadUrlsRequest = ReturnType<
  typeof problemGetUploadUrlsBuilder.getRequestType
>;
export type ProblemGetUploadUrls = SuccessResponse<{
  [key: string]: SignedUploadUrl;
}>;
export type ProblemGetUploadUrlsResposne = Response<ProblemGetUploadUrls>;

// DELETE CLOUDFLARE OBJECTS

export const cloudflareObjectsDeleteSchema = {
  body: z.object({
    filekeys: z.array(
      z.string({
        invalid_type_error: messages.invalidType("ProblemFileKey", "string"),
        required_error: messages.required("ProblemFileKey"),
      })
    ),
  }),
};

const cloudflareObjectsDeleteBuilder = new AuthRequestBuilder(
  cloudflareObjectsDeleteSchema
);
export type CloudflareObjectsDeleteRequest = ReturnType<
  typeof cloudflareObjectsDeleteBuilder.getRequestType
>;
export type CloudflareObjectsDelete = SuccessResponse<{}>;
export type CloudflareObjectsDeleteResposne = Response<CloudflareObjectsDelete>;
