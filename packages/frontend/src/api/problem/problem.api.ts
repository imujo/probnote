import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import {
  ProblemGetUploadUrls,
  ProblemPost,
} from "@probnote/backend/src/components/problem/types.problem";
import env from "@/config/env.config";
import { GetToken } from "@clerk/types";
import ResponseError from "utils/ResponseError";

export const postProblems = async (
  problemFileKeys: string[],
  exerciseNoteId: number,
  getAuthToken: GetToken,
) => {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER}/problem`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify({
      problemFileKeys,
      exerciseNoteId,
    }),
    cache: "no-store",
  });

  const responseJson = await response.json();
  const data = responseJson as ProblemPost;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const getProblemUploadUrls = async (
  filenames: string[],
  getAuthToken: GetToken,
) => {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER}/problem/uploadUrls`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify({
      filenames,
    }),
    cache: "no-store",
  });

  const responseJson = await response.json();
  const data = responseJson as ProblemGetUploadUrls;

  console.log(data);

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};
