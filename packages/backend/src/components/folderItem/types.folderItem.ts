import { z } from "zod";
import RequestBuilder from "../../utils/requestResponseBuilders";
import { SuccessResponse, SortSchema } from "../../globalTypes";
import messages from "../../messages";
import { Response } from "express";

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

const folderItemsGetBuilder = new RequestBuilder(folderItemsGetSchema);
export type FolderItemsGetRequest = ReturnType<
  typeof folderItemsGetBuilder.getRequestType
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
  }[]
>;
export type FolderItemsGetResponse = Response<FolderItemsGet>;

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
const folderItemPutBuilder = new RequestBuilder(folderItemPutSchema);
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

const folderItemDeleteBuilder = new RequestBuilder(folderItemDeleteSchema);
export type FolderItemDeleteRequest = ReturnType<
  typeof folderItemDeleteBuilder.getRequestType
>;
export type FolderItemDelete = SuccessResponse<{
  folderItemId: number;
}>;

export type FolderItemDeleteResposne = Response<FolderItemDelete>;
