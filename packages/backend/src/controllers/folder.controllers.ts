import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

const get = (
  req: Request<{
    id: string;
  }>,
  res: Response
) => {
  req.params.id;
};
