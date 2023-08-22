import { z } from "zod";
import RequestBuilder from "../../utils/requestResponseBuilders";
import { ResponseType, SortSchema } from "../../globalTypes";
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
  query: SortSchema,
};

const folderGetBuilder = new RequestBuilder(folderGetSchema);
export type FolderGetRequest = ReturnType<
  typeof folderGetBuilder.getRequestType
>;
export type FolderGetResposne = ResponseType<
  {
    ChildFolders: {
      id: number;
      label: string;
    }[];
    Note: {
      id: number;
      label: string;
    }[];
  } & {
    id: number;
    label: string;
    parentFolderId: number | null;
    createdAt: Date;
    updatedAt: Date;
  }
>;

// GET BASE FOLDER

export const folderGetBaseSchema = {
  query: SortSchema,
};

const folderGetBaseBuilder = new RequestBuilder(folderGetBaseSchema);
export type FolderGetBaseRequest = ReturnType<
  typeof folderGetBaseBuilder.getRequestType
>;
export type FolderGetBaseResposne = ResponseType<{
  ChildFolders: {
    id: number;
    label: string;
  }[];
  Note: {
    id: number;
    label: string;
  }[];
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
