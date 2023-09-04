import { z } from "zod";
import { Response } from "express";
import { AuthRequestBuilder } from "../../utils/requestResponseBuilders";
import { SuccessResponse } from "../../globalTypes";
import messages from "../../messages";

// POST EXERCISE

export const exerciseNotePostSchema = {
  body: z.object({
    label: z.string({
      invalid_type_error: messages.invalidType("Label", "string"),
      required_error: messages.required("Label"),
    }),
    parentFolderId: z.union([z.number(), z.null()], {
      invalid_type_error: messages.invalidType(
        "ParentFolderId",
        "number or null"
      ),
      required_error: messages.required("ParentFolderId"),
    }),
  }),
};

const exerciseNotePostBuilder = new AuthRequestBuilder(exerciseNotePostSchema);
export type ExerciseNotePostRequest = ReturnType<
  typeof exerciseNotePostBuilder.getRequestType
>;
export type ExerciseNotePost = SuccessResponse<{
  exerciseNoteId: number;
}>;
export type ExerciseNotePostResposne = Response<ExerciseNotePost>;
