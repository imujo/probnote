import { z } from "zod";
import { Response } from "express";
import { AuthRequestBuilder } from "../../utils/requestResponseBuilders";
import { SuccessResponse } from "../../globalTypes";
import messages from "../../messages";

// GET REGULAR NOTE

export const regularNoteGetSchema = {
  params: z.object({
    regularNoteId: z
      .string({
        required_error: messages.required("regularNoteId"),
      })
      .regex(/^\d+$/, messages.invalidType("regularNoteId", "number")),
  }),
};

const regularNoteGetBuilder = new AuthRequestBuilder(regularNoteGetSchema);
export type RegularNoteGetRequest = ReturnType<
  typeof regularNoteGetBuilder.getRequestType
>;
export type RegularNoteGet = SuccessResponse<{
  id: number;
  canvas: string;
  parentFolderId: number | null;
}>;
export type RegularNoteGetResposne = Response<RegularNoteGet>;

// POST REGULAR NOTE

export const regularNotePostSchema = {
  body: z.object({
    label: z.string({
      invalid_type_error: messages.invalidType("label", "string"),
      required_error: messages.required("label"),
    }),
    parentFolderId: z.union([z.number(), z.null()], {
      invalid_type_error: messages.invalidType(
        "parentFolderId",
        "number or null"
      ),
      required_error: messages.required("parentFolderId"),
    }),
  }),
};

const regularNotePostBuilder = new AuthRequestBuilder(regularNotePostSchema);
export type RegularNotePostRequest = ReturnType<
  typeof regularNotePostBuilder.getRequestType
>;
export type RegularNotePost = SuccessResponse<{
  regularNoteId: number;
}>;
export type RegularNotePostResposne = Response<RegularNotePost>;

// PUT REGULAR NOTE

export const regularNotePutSchema = {
  body: z.object({
    canvas: z.record(z.unknown()),
  }),
  params: z.object({
    regularNoteId: z
      .string({
        required_error: messages.required("regularNoteId"),
      })
      .regex(/^\d+$/, messages.invalidType("regularNoteId", "number")),
  }),
};

const regularNotePutBuilder = new AuthRequestBuilder(regularNotePutSchema);
export type RegularNotePutRequest = ReturnType<
  typeof regularNotePutBuilder.getRequestType
>;
export type RegularNotePut = SuccessResponse<{
  id: number;
}>;
export type RegularNotePutResposne = Response<RegularNotePut>;
