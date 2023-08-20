import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { z } from "zod";
import { RequestBuilder } from "../../utils/requestResponseBuilders";
const prisma = new PrismaClient();

const folderGetSchema = {
  params: z.object({
    id: z.number({
      invalid_type_error: "Invalid Type: Id is not a valid number",
      required_error: "Required Field: Id is a required field",
    }),
  }),
};

const folderSchema = new RequestBuilder(folderGetSchema);
type FolderGetRequest = ReturnType<typeof folderSchema.getRequestType>;

const get = (req: FolderGetRequest, res: Response) => {
  try {
    const id = req.params.id;
  } catch (error) {}
};
