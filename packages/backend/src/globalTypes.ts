import { Response } from "express";

export type ResponseType<T> = Response<
  {
    message: string;
  } & (
    | {
        data: T;
        error: boolean;
      }
    | {
        data: null;
        error: true;
      }
  )
>;
