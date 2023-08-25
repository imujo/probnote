import env from "@/config/env.config";
import { FolderGet } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";

export const getFolder = async (folderId: number) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folder/${folderId}?sortBy=label&sortOrder=asc`,
    {
      cache: "no-store",
    },
  );

  const data = (await response.json()) as FolderGet;

  if (!response.ok) {
    console.log(data);
    const error = data as ErrorResponse;
    throw new Error(error.message);
  }

  return data;
};
