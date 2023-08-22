import { Request } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ResponseType } from "../globalTypes";
import CustomError from "../utils/CustomError";

export default function errorMiddleware(
  err: Error,
  req: Request,
  res: ResponseType<string>
) {
  let message = "Ooops, something went wrong with the server";
  let status = 500;

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
  res.status(status).json({ data: null, message, error: true });
}
