import { z } from "zod";
import { Response } from "express";
import { AuthRequestBuilder } from "../../utils/requestResponseBuilders";
import { SuccessResponse } from "../../globalTypes";
import messages from "../../messages";
import { Prisma } from "@prisma/client";

// GET PROBLEM

export const problemGetSchema = {
  params: z.object({
    problemId: z
      .string({
        required_error: messages.required("ExerciseNoteId"),
      })
      .regex(/^\d+$/, messages.invalidType("ExerciseNoteId", "number")),
  }),
};

const problemGetBuilder = new AuthRequestBuilder(problemGetSchema);
export type ProblemGetRequest = ReturnType<
  typeof problemGetBuilder.getRequestType
>;
export type ProblemGet = SuccessResponse<{
  id: number;
  url: string;
  canvas: Prisma.JsonValue;
}>;
export type ProblemGetResposne = Response<ProblemGet>;

// GET PROBLEMS

export const problemsGetSchema = {
  params: z.object({
    exerciseNoteId: z
      .string({
        required_error: messages.required("ExerciseNoteId"),
      })
      .regex(/^\d+$/, messages.invalidType("ExerciseNoteId", "number")),
  }),
};

const problemsGetBuilder = new AuthRequestBuilder(problemsGetSchema);
export type ProblemsGetRequest = ReturnType<
  typeof problemsGetBuilder.getRequestType
>;
export type ProblemsGet = SuccessResponse<{
  problems: {
    id: number;
    url: string;
    edited: boolean;
  }[];
}>;
export type ProblemsGetResposne = Response<ProblemsGet>;

// POST PROBLEMS

export const problemsPostSchema = {
  body: z.object({
    fileKeys: z.array(
      z
        .string({
          invalid_type_error: messages.invalidType("FileKey", "string"),
          required_error: messages.required("FileKey"),
        })
        .min(1, messages.arrayMinLength("fileKeys"))
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
    fileKeys: z
      .array(
        z.string({
          invalid_type_error: messages.invalidType("FileKey", "string"),
          required_error: messages.required("FileKey"),
        })
      )
      .min(1, messages.arrayMinLength("fileKeys")),
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
