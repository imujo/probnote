import { FolderGetParents } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import env from "../../config/env.config";
import { GetToken } from "@clerk/types";

// eslint-disable-next-line  import/prefer-default-export
export const getBreadcrumbs = async (
  folderId: number,
  getAuthToken: GetToken,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/folder/parents/${folderId}`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    },
  );

  const data = (await response.json()) as FolderGetParents;

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message);
  }

  return data;
};
