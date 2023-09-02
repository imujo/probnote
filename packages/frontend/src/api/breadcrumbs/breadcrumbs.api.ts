import { FolderGetParents } from "@probnote/backend/src/components/folder/types.folder";
import env from "../../config/env.config";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";

export const getBreadcrumbs = async (folderId: number) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folder/parents/${folderId}`,
    {
      cache: "no-store",
    },
  );

  const data = (await response.json()) as FolderGetParents;

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message);
  }

  return data;
};
