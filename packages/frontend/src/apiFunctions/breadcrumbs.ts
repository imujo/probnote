import { FolderGetParentsResposne } from "@probnote/backend/src/components/folder/types.folder";
import { Response } from "express";

type BodyType<T> = T extends Response<infer U, any> ? U : never;
type Data = BodyType<FolderGetParentsResposne>;

export const getBreadcrumbs = async (folderId: string) => {
  const response = await fetch(
    `http://localhost:3001/folder/parents/${folderId}`,
    {
      cache: "no-store",
    },
  );

  return response.json() as Promise<Data>;
};
