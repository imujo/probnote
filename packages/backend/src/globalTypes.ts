import { z } from "zod";

export type SuccessResponse<T> = {
  message: string;
  data: T;
};

export type ErrorResponse = {
  message: string;
};

export const SortSchema = z.object({
  sortOrder: z.union([z.literal("asc"), z.literal("desc")]),
  sortBy: z.string(),
});

export type Sort = z.infer<typeof SortSchema>;
