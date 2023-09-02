import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import {
  FolderGetPinned,
  FolderPost,
  FolderPut,
  FolderPutBody,
} from "@probnote/backend/src/components/folder/types.folder";
import env from "@/config/env.config";

export const getPinnedFolders = async () => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folder/pinned?sortBy=datePinned&sortOrder=desc`,
    {
      cache: "no-store",
    },
  );

  const data = (await response.json()) as FolderGetPinned;

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message);
  }

  return data;
};

export const postFolder = async (
  label: string,
  parentFolderId: number | null,
) => {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER}/folder`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      label,
      parentFolderId:
        parentFolderId === null ? null : parseFloat(parentFolderId.toString()),
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as FolderPost;

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message);
  }

  return data;
};

export const putFolder = async (folderId: number, body: FolderPutBody) => {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER}/folder/${folderId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json()) as FolderPut;

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message);
  }

  return data;
};
