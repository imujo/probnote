import { z } from "zod";
import { Response } from "express";
import { AuthRequestBuilder } from "../../utils/requestResponseBuilders";
import { SuccessResponse } from "../../globalTypes";
import messages from "../../messages";
import { SignedUploadUrl } from "./service.cloudflare";

// GET UPLOAD URLS

export const cloudflareGetUploadUrlsSchema = {
  body: z.object({
    fileNames: z
      .array(
        z.string({
          invalid_type_error: messages.invalidType("FileNames", "string"),
          required_error: messages.required("FileNames"),
        })
      )
      .min(1, messages.arrayMinLength("fileNames")),
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
    fileKeys: z.array(
      z
        .string({
          invalid_type_error: messages.invalidType("FileKeys", "string"),
          required_error: messages.required("FileKeys"),
        })
        .min(1, messages.arrayMinLength("fileKeys"))
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
