import { RequestBuilder } from "../../utils/requestResponseBuilders";
import { z } from "zod";
import { ResponseType } from "../../globalTypes";
import messages from "../../messages";

// GET FOLDER

export const folderGetSchema = {
  params: z.object({
    id: z
      .string({
        required_error: messages.required("Id"),
      })
      .regex(/^\d+$/, messages.invalidType("Id", "number")),
  }),
};

const folderGetBuilder = new RequestBuilder(folderGetSchema);
export type FolderGetRequest = ReturnType<
  typeof folderGetBuilder.getRequestType
>;
export type FolderGetResposne = ResponseType<{
  id: number;
  label: string;
  parentFolderId: number | null;
  createdAt: Date;
  updatedAt: Date;
}>;

// GET FOLDER PARENTS

export const folderGetParentsSchema = {
  params: z.object({
    id: z
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
export type FolderGetParentsResposne = ResponseType<
  {
    id: number;
    label: string;
  }[]
>;

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
export type FolderPostResposne = ResponseType<{
  id: number;
}>;

// PUT FOLDER

export const folderPutSchema = {
  params: z.object({
    id: z
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

const folderPutBuilder = new RequestBuilder(folderPutSchema);
export type FolderPutRequest = ReturnType<
  typeof folderPutBuilder.getRequestType
>;
export type FolderPutResposne = ResponseType<{
  id: number;
}>;

// DELETE FOLDER

// GET FOLDER

export const folderDeleteSchema = {
  params: z.object({
    id: z
      .string({
        required_error: messages.required("Id"),
      })
      .regex(/^\d+$/, messages.invalidType("Id", "number")),
  }),
};

const folderDeleteBuilder = new RequestBuilder(folderDeleteSchema);
export type FolderDeleteRequest = ReturnType<
  typeof folderDeleteBuilder.getRequestType
>;
export type FolderDeleteResposne = ResponseType<{
  id: number;
}>;
