import { Response } from "express";

export type ResponseType<T> = Response<
  {
    message: string;
  } & (
    | {
        data: T;
        error: false;
      }
    | {
        data: null;
        error: true;
      }
  )
>;
