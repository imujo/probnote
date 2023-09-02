import { FolderId } from "../../types.global";

export const getFolderItems = (parentFolderId: FolderId) => [
  "folder",
  "get",
  parentFolderId,
];
export const getPinnedFolders = () => ["folder", "get", "pinned"];

export default {
  getFolderItems,
  getPinnedFolders,
};
