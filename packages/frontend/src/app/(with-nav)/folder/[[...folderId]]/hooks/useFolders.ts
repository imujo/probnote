import {
  FolderGet,
  FolderGetChildren,
} from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { useQuery } from "react-query";
import { FolderChild } from "../components/Folders/Folders.types";
import { getFolder } from "apiFunctions/folders.api";

export default function useFolders(folderId: number | "base") {
  return useQuery<FolderGetChildren, ErrorResponse, FolderChild[]>({
    queryKey: ["folder", folderId],
    queryFn: () => getFolder(folderId),
    select: (data) => {
      const notes: FolderChild[] = data
        ? data?.data.Note.map((note) => {
            return { ...note, type: "note" };
          })
        : [];

      const folders: FolderChild[] = data
        ? data?.data.ChildFolders.map((note) => {
            return { ...note, type: "folder" };
          })
        : [];

      return [...folders, ...notes];
    },
  });
}
