import { useCallback, useEffect, useMemo, useState } from "react";
import { FileData, UploadState } from "utils/upload";
import useDeleteProblemsByFileKeys from "../../../../../api/problem/hooks/useDeleteProblemsByFileKeys";
import useProblemsDropzone from "./useProblemsDropzone";
import usePostProblems from "api/problem/hooks/usePostProblems";

export default function useAddProblems() {
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [doneFileData, setDoneFileData] = useState<FileData[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>("INITIAL");
  const [modalOpen, setModalOpen] = useState(false);

  // useEffect(() => {
  //   console.log(fileData);
  // }, [fileData]);

  const { mutate: del } = useDeleteProblemsByFileKeys();

  const removeFile = useCallback(
    (index: number) => {
      setFileData((prev) => {
        const updatedFileData = [...prev];
        updatedFileData.splice(index, 1);

        if (uploadState === "ERROR" && updatedFileData.length === 0)
          if (doneFileData.length === 0) setUploadState("INITIAL");
          else setUploadState("DONE");

        return updatedFileData;
      });
    },
    [setFileData, doneFileData],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const fileList = Array.from(acceptedFiles);
      const updatedFileData: FileData[] = fileList.map((file) => ({
        file: file,
        state: "INITIAL",
      }));

      setFileData((prev) => [...prev, ...updatedFileData]);
    },
    [setFileData],
  );

  const deleteProblems = useCallback(() => {
    if (doneFileData.length === 0) return;
    del(
      doneFileData.map((fileDatum) => {
        if (!fileDatum.fileKey) throw new Error("File with no filekey");
        return fileDatum.fileKey;
      }),
    );
  }, [doneFileData, del]);

  const dropzoneDisabled = useMemo(
    () => uploadState !== "INITIAL",
    [uploadState],
  );

  const allFileData = useMemo(
    () => [...fileData, ...doneFileData],
    [fileData, doneFileData],
  );

  const reset = useCallback(() => {
    setFileData([]);
    setDoneFileData([]);
    setUploadState("INITIAL");
  }, []);

  const closeDisabled = uploadState === "LOADING";
  const closeAndDelete = uploadState === "DONE" || uploadState === "ERROR";

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => reset(), 300);
  }, [setModalOpen]);

  const closeModalAndDelete = useCallback(
    (e?: Event | React.MouseEvent) => {
      if (closeDisabled && e) return e.preventDefault();
      if (closeAndDelete) {
        deleteProblems();
      }
      closeModal();
    },
    [closeDisabled, deleteProblems, setModalOpen],
  );

  const setModalOpenWithCloseFunction = useCallback(
    (open: boolean) => {
      if (!open) closeModal();
      else setModalOpen(true);
    },
    [closeModal, setModalOpen],
  );

  const dropzone = useProblemsDropzone({
    onDrop,
    disabled: dropzoneDisabled,
    fileData,
  });

  const upload = usePostProblems({
    fileData,
    setFileData,
    setDoneFileData,
    setUploadState,
  });

  return {
    fileData: allFileData,
    dropzone,
    upload,
    removeFile,
    uploadState,
    modalOpen,
    setModalOpen: setModalOpenWithCloseFunction,
    closeModalAndDelete,
    closeModal,
  };
}
