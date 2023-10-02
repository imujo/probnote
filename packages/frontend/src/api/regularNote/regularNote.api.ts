import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";
import {
  RegularNoteGet,
  RegularNotePost,
  RegularNotePut,
} from "@probnote/backend/src/components/regularNote/types.regularNote";
import env from "@/config/env.config";
import { GetToken } from "@clerk/types";
import ResponseError from "utils/ResponseError";
import { FolderId } from "utils/types.global";

export const getRegularNote = async (
  regularNoteId: number,
  getAuthToken: GetToken,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/regularNote/${regularNoteId}`,
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
  const data = responseJson as RegularNoteGet;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const postRegularNote = async (
  label: string,
  parentFolderId: FolderId,
  getAuthToken: GetToken,
) => {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER}/regularNote`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify({
      label,
      parentFolderId:
        parentFolderId === null ? null : parseFloat(parentFolderId.toString()),
    }),
    cache: "no-store",
  });

  const responseJson = await response.json();
  const data = responseJson as RegularNotePost;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const putRegularNote = async (
  regularNoteId: number,
  canvas: ImportedDataState,
  getAuthToken: GetToken,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/regularNote/${regularNoteId}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({
        canvas,
      }),
      cache: "no-store",
    },
  );

  const responseJson = await response.json();
  const data = responseJson as RegularNotePut;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};
