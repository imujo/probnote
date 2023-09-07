import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import useExerciseNoteId from "hooks/useExerciseNoteId";
import { Dispatch, SetStateAction, useState } from "react";
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

type UsePostProblemsProps = {
  fileData: FileData[];
  setFileData: Dispatch<SetStateAction<FileData[]>>;
  setDoneFileData: Dispatch<SetStateAction<FileData[]>>;
  setUploadState: Dispatch<SetStateAction<UploadState>>;
};

export default function usePostProblems({
  fileData,
  setFileData,
  setDoneFileData,
  setUploadState,
}: UsePostProblemsProps) {
  const { getToken } = useAuth();
  const exerciseNoteId = useExerciseNoteId();
  const { toast } = useToast();

  const upload = async () => {
    try {
      if (fileData.length === 0) throw new Error("No files selected");
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

  return upload;
}
