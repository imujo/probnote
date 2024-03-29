import { FolderId } from "./types.global";

export const getFolderItems = (parentFolderId: FolderId) => [
  "folder",
  "get",
  parentFolderId,
];
export const searchFolderItems = (query: string) => ["folder", "search", query];
export const getBreadcrumbs = (folderId: FolderId) => [
  "breadcrumbs",
  "get",
  folderId,
];
export const getProblems = (exerciseNoteId: number) => [
  "problems",
  "get",
  exerciseNoteId,
];
export const getProblem = (problemId: number) => ["problem", "get", problemId];
export const getPinnedFolders = () => ["folder", "get", "pinned"];
export const getRegularNote = (regularNoteId: number) => [
  "regularNote",
  "get",
  regularNoteId,
];

export default {
  getFolderItems,
  getPinnedFolders,
  getBreadcrumbs,
  searchFolderItems,
  getProblems,
  getProblem,
  getRegularNote,
};
