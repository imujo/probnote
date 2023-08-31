import { FolderGet } from "@probnote/backend/src/components/folder/types.folder";

export type FolderChild = FolderGet["data"]["Note"][0] &
  (
    | {
        type: "note";
      }
    | {
        type: "folder";
        pinned: boolean;
      }
  );
