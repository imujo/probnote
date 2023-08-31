import { FolderId } from "../../types.global";

export const getFolders = (folderId: FolderId) => ["folder", "get", folderId];
export const getPinnedFolders = () => ["folder", "get", "pinned"];

export default {
  getFolders,
  getPinnedFolders,
};
