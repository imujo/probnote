import {
  FolderGet,
  FolderGetChildren,
} from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { useQuery } from "react-query";
import { FolderChild } from "../components/Folders/Folders.types";
import { getFolder } from "apiFunctions/folders.api";
import { FolderId } from "../../../../../../types.global";
import queryKeys from "utils/queryKeys";
import { useToast } from "@/components/ui/use-toast";

export default function useFolders(folderId: FolderId) {
  const queryKey = queryKeys.getFolders(folderId);
  const { toast } = useToast();

  return useQuery<FolderGetChildren, ErrorResponse, FolderChild[]>({
    queryKey: queryKey,
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
    onError: (err) => {
      toast({
        title: "An error occured tying to fetch folders",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
