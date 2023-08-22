import { Response } from "express";
import { z } from "zod";

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

export const SortSchema = z.object({
  sort_order: z.union([z.literal("asc"), z.literal("desc")]),
  sort_by: z.string(),
});

export type Sort = z.infer<typeof SortSchema>;
