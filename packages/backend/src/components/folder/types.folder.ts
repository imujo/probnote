import { z } from "zod";
import RequestBuilder from "../../utils/requestResponseBuilders";
import { SuccessResponse, SortSchema } from "../../globalTypes";
import messages from "../../messages";
import { Response } from "express";

// GET FOLDER PARENTS

export const folderGetParentsSchema = {
  params: z.object({
    folderId: z
      .string({
        required_error: messages.required("Id"),
      })
      .regex(/^\d+$/, messages.invalidType("Id", "number")),
  }),
};

const folderGetParentsBuilder = new RequestBuilder(folderGetParentsSchema);
export type FolderGetParentsRequest = ReturnType<
  typeof folderGetParentsBuilder.getRequestType
>;
export type FolderGetParents = SuccessResponse<{
  parentFolders: {
    folderId: number;
    label: string;
  }[];
  more: boolean;
}>;
export type FolderGetParentsResposne = Response<FolderGetParents>;

// POST FOLDER

export const folderPostSchema = {
  body: z.object({
    label: z.string({
      invalid_type_error: messages.invalidType("Label", "string"),
      required_error: messages.required("Label"),
    }),
    parentFolderId: z.union([z.number(), z.null()], {
      invalid_type_error: messages.invalidType(
        "ParentFolderId",
        "number or null"
      ),
      required_error: messages.required("ParentFolderId"),
    }),
  }),
};

const folderPostBuilder = new RequestBuilder(folderPostSchema);
export type FolderPostRequest = ReturnType<
  typeof folderPostBuilder.getRequestType
>;
export type FolderPost = SuccessResponse<{
  folderId: number;
}>;
export type FolderPostResposne = Response<FolderPost>;

// PUT FOLDER

export const folderPutSchema = {
  params: z.object({
    folderId: z
      .string({
        required_error: messages.required("Id"),
      })
      .regex(/^\d+$/, messages.invalidType("Id", "number")),
  }),
  body: z.object({
    pinned: z
      .boolean({
        invalid_type_error: messages.invalidType("Pinned", "boolean"),
      })
      // .regex(/^(true|false)$/, messages.invalidType("Pinned", "boolean"))
      .optional(),
  }),
};

export type FolderPutBody = z.infer<(typeof folderPutSchema)["body"]>;
const folderPutBuilder = new RequestBuilder(folderPutSchema);
export type FolderPutRequest = ReturnType<
  typeof folderPutBuilder.getRequestType
>;
export type FolderPut = SuccessResponse<{
  folderId: number;
}>;

export type FolderPutResposne = Response<FolderPut>;

// GET PINNED FOLDER

export const folderGetPinnedSchema = {
  query: SortSchema,
};

const folderGetPinnedBuilder = new RequestBuilder(folderGetPinnedSchema);
export type FolderGetPinnedRequest = ReturnType<
  typeof folderGetPinnedBuilder.getRequestType
>;
export type FolderGetPinned = SuccessResponse<
  {
    folderItemId: number;
    folderId: number;
    label: string;
  }[]
>;
export type FolderGetPinnedResponse = Response<FolderGetPinned>;
