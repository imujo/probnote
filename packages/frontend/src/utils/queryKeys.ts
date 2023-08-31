import { FolderId } from "../../types.global";

export const getFolders = (folderId: FolderId) => ["folder", "get", folderId];

export default {
  getFolders,
};
