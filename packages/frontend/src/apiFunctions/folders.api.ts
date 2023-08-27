import env from "@/config/env.config";
import {
  FolderGetChildren,
  FolderPost,
} from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";

export const getFolder = async (folderId: number | "base") => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folder/${folderId}/children?sortBy=label&sortOrder=asc`,
    {
      cache: "no-store",
    },
  );

  const data = (await response.json()) as FolderGetChildren;

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
      label: label,
      parentFolderId:
        parentFolderId === null ? null : parseFloat(parentFolderId + ""),
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
