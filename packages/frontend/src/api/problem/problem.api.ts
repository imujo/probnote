import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";
import {
  ProblemGet,
  ProblemPost,
  ProblemPut,
  ProblemsDeleteByFileKeys,
  ProblemsGet,
} from "@probnote/backend/src/components/problem/types.problem";
import env from "@/config/env.config";
import { GetToken } from "@clerk/types";
import ResponseError from "utils/ResponseError";

export const getProblem = async (problemId: number, getAuthToken: GetToken) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/problem/${problemId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      cache: "no-store",
    },
  );

  const responseJson = await response.json();
  const data = responseJson as ProblemGet;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const getProblems = async (
  exerciseNoteId: number,
  getAuthToken: GetToken,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/problem/multiple/${exerciseNoteId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      cache: "no-store",
    },
  );

  const responseJson = await response.json();
  const data = responseJson as ProblemsGet;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const postProblems = async (
  fileKeys: string[],
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
      fileKeys,
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

export const putProblem = async (
  problemId: number,
  canvas: ImportedDataState,
  canvasUpdatedTimestamp: number,
  getAuthToken: GetToken,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/problem/${problemId}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({
        canvas,
        canvasUpdatedTimestamp: canvasUpdatedTimestamp,
      }),
      cache: "no-store",
    },
  );

  const responseJson = await response.json();
  const data = responseJson as ProblemPut;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const deleteProblemsByFileKeys = async (
  fileKeys: string[],
  getAuthToken: GetToken,
) => {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER}/problem/byFileKeys`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify({
      fileKeys,
    }),
    cache: "no-store",
  });

  const responseJson = await response.json();
  const data = responseJson as ProblemsDeleteByFileKeys;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};
