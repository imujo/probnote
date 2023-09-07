import { z } from "zod";
import { Response } from "express";
import { AuthRequestBuilder } from "../../utils/requestResponseBuilders";
import { SuccessResponse } from "../../globalTypes";
import messages from "../../messages";
import { SignedUploadUrl } from "./service.cloudflare";

// GET UPLOAD URLS

export const cloudflareGetUploadUrlsSchema = {
  body: z.object({
    filenames: z.array(
      z.string({
        invalid_type_error: messages.invalidType("ProblemFileKey", "string"),
        required_error: messages.required("ProblemFileKey"),
      })
    ),
  }),
};

const cloudflareGetUploadUrlsBuilder = new AuthRequestBuilder(
  cloudflareGetUploadUrlsSchema
);
export type CloudflareGetUploadUrlsRequest = ReturnType<
  typeof cloudflareGetUploadUrlsBuilder.getRequestType
>;
export type CloudflareGetUploadUrls = SuccessResponse<{
  [key: string]: SignedUploadUrl;
}>;
export type CloudflareGetUploadUrlsResposne = Response<CloudflareGetUploadUrls>;

// DELETE CLOUDFLARE OBJECTS

export const cloudflareDeleteObjectsSchema = {
  body: z.object({
    filekeys: z.array(
      z.string({
        invalid_type_error: messages.invalidType("filekeys", "string"),
        required_error: messages.required("filekeys"),
      })
    ),
  }),
};

const cloudflareDeleteObjectsBuilder = new AuthRequestBuilder(
  cloudflareDeleteObjectsSchema
);
export type CloudflareDeleteObjectsRequest = ReturnType<
  typeof cloudflareDeleteObjectsBuilder.getRequestType
>;
export type CloudflareDeleteObjects = SuccessResponse<{}>;
export type CloudflareDeleteObjectsResposne = Response<CloudflareDeleteObjects>;
