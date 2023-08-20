import { RequestBuilder } from "../../utils/requestResponseBuilders";
import { z } from "zod";
import { ResponseType } from "../../globalTypes";

// GET FOLDER

export const folderGetSchema = {
  params: z.object({
    id: z
      .string({
        required_error: "Required Field: Id is a required field",
      })
      .regex(/^\d+$/, "Invalid Type: Id is not a valid number"),
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
  parentFolders: {
    id: number;
    label: string;
  }[];
}>;

// POST FOLDER
