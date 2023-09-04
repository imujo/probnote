import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import {
  FolderGetPinned,
  FolderPost,
  FolderPut,
  FolderPutBody,
} from "@probnote/backend/src/components/folder/types.folder";
import env from "@/config/env.config";
import { GetToken } from "@clerk/types";
import ResponseError from "utils/ResponseError";

export const getPinnedFolders = async (getAuthToken: GetToken) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folder/pinned?sortBy=datePinned&sortOrder=desc`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    },
  );

  const responseJson = await response.json();
  const data = responseJson as FolderGetPinned;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const postFolder = async (
  label: string,
  parentFolderId: number | null,
  getAuthToken: GetToken,
) => {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER}/folder`, {
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
  const data = responseJson as FolderPost;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const putFolder = async (
  folderId: number,
  body: FolderPutBody,
  getAuthToken: GetToken,
) => {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER}/folder/${folderId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const responseJson = await response.json();
  const data = responseJson as FolderPut;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};
