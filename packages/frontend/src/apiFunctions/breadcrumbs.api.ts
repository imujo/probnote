import { FolderGetParents } from "@probnote/backend/src/components/folder/types.folder";

export const getBreadcrumbs = async (folderId: number) => {
  const response = await fetch(
    `http://localhost:3001/folder/parents/${folderId}`,
    {
      cache: "no-store",
    },
  );

  return (await response.json()) as FolderGetParents;
};
