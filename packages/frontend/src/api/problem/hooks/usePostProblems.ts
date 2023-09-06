import {
  deleteCloudflareFiles,
  getProblemUploadUrls,
  postProblems,
} from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  FileData,
  UploadState,
  getProblemUploadUrlsOrError,
  postProblemsOrDeleteUploads,
  setFileDataState,
  setFileStateDone,
  setProblemUploadUrls,
  uploadFiles,
} from "utils/upload";
import useExerciseNoteId from "hooks/useExerciseNoteId";
import { useDropzone } from "react-dropzone";

export default function usePostProblems() {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const exerciseNoteId = useExerciseNoteId();

  const [fileData, setFileData] = useState<FileData[] | null>(null);
  const [doneFileData, setDoneFileData] = useState<FileData[] | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("INITIAL");

  const removeFile = (index: number) => {
    if (!fileData) throw new Error("No files selected");

    const updatedFileData = [...fileData];
    updatedFileData.splice(index, 1);

    if (uploadState === "ERROR" && updatedFileData.length === 0)
      setUploadState("DONE");

    setFileData(updatedFileData);
  };

  const onInputChange = (acceptedFiles: File[]) => {
    const fileList = Array.from(acceptedFiles);
    const updatedFileData: FileData[] = fileList.map((file) => ({
      file: file,
      state: "INITIAL",
    }));

    setFileData((prev) => [...(prev || []), ...updatedFileData]);
  };

  const upload = async () => {
    try {
      if (!fileData) throw new Error("No files selected");
      let updatedFileData = [...fileData];

      setUploadState("LOADING");

      updatedFileData = setFileDataState(
        updatedFileData,
        setFileData,
        "GET_UPLOAD_URLS",
      );

      const { data: problemUrls } = await getProblemUploadUrlsOrError(
        updatedFileData,
        getToken,
        setFileData,
        setUploadState,
      );

      updatedFileData = setProblemUploadUrls(
        updatedFileData,
        problemUrls,
        setFileData,
      );

      updatedFileData = await uploadFiles(
        updatedFileData,
        setFileData,
        setUploadState,
      );

      updatedFileData = await postProblemsOrDeleteUploads(
        updatedFileData,
        exerciseNoteId,
        getToken,
        setFileData,
        setUploadState,
      );

      setFileStateDone(
        updatedFileData,
        setFileData,
        setDoneFileData,
        setUploadState,
      );
    } catch (error) {
      toast({
        title: "An error occuerd trying to upload images",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    }
  };

  const dropzoneDisabled = useMemo(
    () => uploadState !== "INITIAL",
    [uploadState],
  );

  const dropzone = useDropzone({
    onDrop: onInputChange,
    disabled: dropzoneDisabled,
    accept: {
      "image/png": [".png", ".jpg"],
      "image/jpeg": [".jpeg", ".png"],
    },
    validator: (file) => {
      if (fileData?.map(({ file }) => file.name).includes(file.name)) {
        toast({
          title: "Could not add file",
          description: `File with name ${file.name} is already added`,
          variant: "destructive",
        });

        return {
          code: "duplicate",
          message: `The file you provided is already added`,
        };
      }
      return null;
    },
  });

  const allFileData = useMemo(() => {
    const fileDataList = fileData === null ? [] : fileData;
    const doneFileDataList = doneFileData === null ? [] : doneFileData;

    return [...fileDataList, ...doneFileDataList];
  }, [fileData, doneFileData]);

  const closeDisabled = useMemo(
    () => uploadState === "LOADING" || uploadState === "ERROR",
    [uploadState],
  );

  const uploadDisabled = useMemo(
    () =>
      fileData === null ||
      fileData.length === 0 ||
      uploadState === "LOADING" ||
      uploadState === "DONE",
    [uploadState, fileData],
  );

  return {
    fileData: allFileData,
    upload,
    removeFile,
    dropzone,
    uploadState,
    dropzoneDisabled,
    closeDisabled,
    uploadDisabled,
  };
}
