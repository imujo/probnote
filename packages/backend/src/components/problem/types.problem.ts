import { z } from "zod";
import { Response } from "express";
import { AuthRequestBuilder } from "../../utils/requestResponseBuilders";
import { SuccessResponse } from "../../globalTypes";
import messages from "../../messages";

// POST PROBLEMS

export const problemsPostSchema = {
  body: z.object({
    problemFileKeys: z.array(
      z.string({
        invalid_type_error: messages.invalidType("ProblemFileKey", "string"),
        required_error: messages.required("ProblemFileKey"),
      })
    ),
    exerciseNoteId: z.number({
      invalid_type_error: messages.invalidType("ExerciseNoteId", "number"),
      required_error: messages.required("ExerciseNoteId"),
    }),
  }),
};

const problemsPostBuilder = new AuthRequestBuilder(problemsPostSchema);
export type ProblemPostRequest = ReturnType<
  typeof problemsPostBuilder.getRequestType
>;
export type ProblemPost = SuccessResponse<{
  count: number;
}>;
export type ProblemPostResposne = Response<ProblemPost>;

// DELETE PROBLEMS BY FILEKEYS

export const problemsDeleteByFileKeysSchema = {
  body: z.object({
    problemFileKeys: z
      .array(
        z.string({
          invalid_type_error: messages.invalidType("ProblemFileKey", "string"),
          required_error: messages.required("ProblemFileKey"),
        })
      )
      .min(1, "At least one problem file key is required"),
  }),
};

const problemsDeleteByFileKeysBuilder = new AuthRequestBuilder(
  problemsDeleteByFileKeysSchema
);
export type ProblemsDeleteByFileKeysRequest = ReturnType<
  typeof problemsDeleteByFileKeysBuilder.getRequestType
>;
export type ProblemsDeleteByFileKeys = SuccessResponse<{
  count: number;
}>;
export type ProblemsDeleteByFileKeysResposne =
  Response<ProblemsDeleteByFileKeys>;
