import { z } from "zod";
import { Response } from "express";
import { AuthRequestBuilder } from "../../utils/requestResponseBuilders";
import { SuccessResponse, SortSchema } from "../../globalTypes";
import messages from "../../messages";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";

// GET FOLDER ITEM

export const folderItemsGetSchema = {
  params: z.object({
    parentFolderId: z
      .string({
        required_error: messages.required("Id"),
      })
      .regex(/^\d+$/, messages.invalidType("Id", "number"))
      .or(z.literal("base")),
  }),
  query: SortSchema,
};

const folderItemsGetBuilder = new AuthRequestBuilder(folderItemsGetSchema);
export type FolderItemsGetRequest = RequireAuthProp<
  ReturnType<typeof folderItemsGetBuilder.getRequestType>
>;

export type FolderItemsGet = SuccessResponse<
  {
    id: number;
    label: string;
    createdAt: Date;
    updatedAt: Date;
    Folder: {
      id: number;
      pinned: boolean;
    } | null;
    Note: {
      ExerciseNote: {
        id: number;
      } | null;
      RegularNote: {
        id: number;
      } | null;
    } | null;
  }[]
>;
export type FolderItemsGetResponse = Response<FolderItemsGet>;

// GET FOLDER SEARCH

export const folderItemsSearchSchema = {
  query: z.object({
    query: z.string({ required_error: messages.required("Query") }),
  }),
};

const folderItemsSearchBuilder = new AuthRequestBuilder(
  folderItemsSearchSchema
);
export type FolderItemsSearchRequest = RequireAuthProp<
  ReturnType<typeof folderItemsSearchBuilder.getRequestType>
>;

export type FolderItemsSearch = SuccessResponse<
  {
    id: number;
    label: string;
    createdAt: Date;
    updatedAt: Date;
    Folder: {
      id: number;
      pinned: boolean;
    } | null;
  }[]
>;
export type FolderItemsSearchResponse = Response<FolderItemsSearch>;

// PUT FOLDER ITEM

export const folderItemPutSchema = {
  params: z.object({
    folderItemId: z
      .string({
        required_error: messages.required("Id"),
      })
      .regex(/^\d+$/, messages.invalidType("Id", "number")),
  }),
  body: z.object({
    label: z
      .string({
        invalid_type_error: messages.invalidType("Label", "string"),
      })
      .optional(),
    parentFolderId: z
      .union([z.number(), z.null()], {
        invalid_type_error: messages.invalidType(
          "ParentFolderId",
          "number or null"
        ),
      })
      .optional(),
  }),
};

export type FolderItemPutBody = z.infer<(typeof folderItemPutSchema)["body"]>;
const folderItemPutBuilder = new AuthRequestBuilder(folderItemPutSchema);
export type FolderItemPutRequest = ReturnType<
  typeof folderItemPutBuilder.getRequestType
>;
export type FolderItemPut = SuccessResponse<{
  folderItemId: number;
}>;

export type FolderItemPutResposne = Response<FolderItemPut>;

// DELETE FOLDER

export const folderItemDeleteSchema = {
  params: z.object({
    folderItemId: z
      .string({
        required_error: messages.required("Id"),
      })
      .regex(/^\d+$/, messages.invalidType("Id", "number")),
  }),
};

const folderItemDeleteBuilder = new AuthRequestBuilder(folderItemDeleteSchema);
export type FolderItemDeleteRequest = ReturnType<
  typeof folderItemDeleteBuilder.getRequestType
>;
export type FolderItemDelete = SuccessResponse<{
  folderItemId: number;
}>;

export type FolderItemDeleteResposne = Response<FolderItemDelete>;
