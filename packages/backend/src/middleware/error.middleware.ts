import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ErrorResponse } from "../globalTypes";
import CustomError from "../utils/CustomError";
import { Prisma } from "@prisma/client";

export default function errorMiddleware(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  let message = "Ooops, something went wrong with the server";
  let status = 500;

  console.log(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code[0] === "2") status = 400;
    message = err.message.split("\n").at(-1) || err.message;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    message = err.message;
  } else if (err instanceof ZodError) {
    status = 400;
    message = err.issues[0].message;
  } else if (err instanceof CustomError) {
    status = err.status;
    message = err.message;
  }

  res.status(status).json({ message });
}
