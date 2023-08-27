import env from "@/config/env.config";
import { FolderGetChildren } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";

export const getFolder = async (folderId: number | "base") => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folder/${folderId}/children?sortBy=label&sortOrder=asc`,
    {
      cache: "no-store",
    },
  );

  const data = (await response.json()) as FolderGetChildren;

  console.log(data);

  if (!response.ok) {
    console.log(data);
    const error = data as ErrorResponse;
    throw new Error(error.message);
  }

  return data;
};
