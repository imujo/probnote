import {
  FolderItemDelete,
  FolderItemsGet,
  FolderItemPut,
  FolderItemPutBody,
  FolderItemsSearch,
} from "@probnote/backend/src/components/folderItem/types.folderItem";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { FolderId } from "../../utils/types.global";
import env from "@/config/env.config";
import { GetToken } from "@clerk/types";
import ResponseError from "utils/ResponseError";

export const getFolderItems = async (
  parentFolderId: FolderId,
  getAuthToken: GetToken,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folderItem/${parentFolderId}?sortBy=label&sortOrder=asc`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    },
  );
  const responseJson = await response.json();
  const data = responseJson as FolderItemsGet;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;

    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const getFolderItemsSearch = async (
  query: string,
  getAuthToken: GetToken,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folderItem/search?query=${query}`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    },
  );
  const responseJson = await response.json();
  const data = responseJson as FolderItemsSearch;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;

    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const deleteFolderItem = async (
  folderItemId: number,
  getAuthToken: GetToken,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folderItem/${folderItemId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      cache: "no-store",
    },
  );

  const responseJson = await response.json();
  const data = responseJson as FolderItemDelete;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const putFolderItem = async (
  folderItemId: number,
  body: FolderItemPutBody,
  getAuthToken: GetToken,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folderItem/${folderItemId}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  const responseJson = await response.json();
  const data = responseJson as FolderItemPut;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};
