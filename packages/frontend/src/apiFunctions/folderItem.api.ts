import env from "@/config/env.config";
import {
  FolderItemDelete,
  FolderItemsGet,
  FolderItemPut,
  FolderItemPutBody,
} from "@probnote/backend/src/components/folderItem/types.folderItem";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { FolderId } from "../../types.global";

export const getFolderItems = async (parentFolderId: FolderId) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folderItem/${parentFolderId}?sortBy=label&sortOrder=asc`,
    {
      cache: "no-store",
    },
  );
  const data = (await response.json()) as FolderItemsGet;

  if (!response.ok) {
    const error = data as ErrorResponse;

    throw new Error(error.message);
  }

  return data;
};

export const deleteFolderItem = async (folderItemId: number) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folderItem/${folderItemId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  const data = (await response.json()) as FolderItemDelete;

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message);
  }

  return data;
};

export const putFolderItem = async (
  folderItemId: number,
  body: FolderItemPutBody,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folderItem/${folderItemId}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  const data = (await response.json()) as FolderItemPut;

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message);
  }

  return data;
};
