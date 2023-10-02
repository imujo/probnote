export default {
  /**
   *
   * @param folderId Id of the folder you want to route to. If left empty, it will route to the base folder
   * @returns Route to folder
   */
  folder: (folderId?: number | "base") => `/folder/${folderId || "base"}`,
  /**
   *
   * @param exerciseNoteId Id of the exercise note
   * @param problemId Id of the problem. If undefined, it will route to the first problem in the exercise note or, if there are no problems in the exercise note, it will route to an empty exercise note page
   * @returns Route to problem
   */
  problem: (exerciseNoteId: number, problemId?: number) =>
    `/note/exercise/${exerciseNoteId}/problem/${problemId || ""}`,
  regularNote: (regularNoteId: number) => `/note/regular/${regularNoteId}`,
  home: () => "/",
};
