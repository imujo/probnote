import { FolderGet } from "@probnote/backend/src/components/folder/types.folder";

export type FolderChild = FolderGet["data"]["ChildFolders"][0] & {
  type: "note" | "folder";
};
