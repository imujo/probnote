import { getProblemUploadUrls, postProblems } from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  FileData,
  onInitiateUpload,
  setFileStateDone,
  setProblemUploadUrls,
  uploadFiles,
} from "utils/upload";
import useExerciseNoteId from "hooks/useExerciseNoteId";

export default function useAll() {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const exerciseNoteId = useExerciseNoteId();

  const [fileData, setFileData] = useState<FileData[] | null>(null);

  const removeFile = (index: number) => {
    if (!fileData) throw new Error("No files selected");

    const updatedFileData = [...fileData];
    updatedFileData.splice(index, 1);

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

  const upload = async (initialFileData: FileData[] | null) => {
    try {
      if (!initialFileData) throw new Error("No files selected");

      let fileData = [...initialFileData];

      fileData = onInitiateUpload(fileData, setFileData);

      const { data: problemUrls } = await getProblemUploadUrls(
        fileData.map(({ file }) => file.name),
        getToken,
      );

      fileData = setProblemUploadUrls(fileData, problemUrls, setFileData);

      fileData = await uploadFiles(fileData, setFileData);

      await postProblems(
        fileData.map((fileDatum) => {
          if (!fileDatum.fileKey)
            throw new Error("Not add files have a file key");
          return fileDatum.fileKey;
        }),
        exerciseNoteId,
        getToken,
      );

      fileData = setFileStateDone(fileData, setFileData);
    } catch (error) {
      toast({
        title: "An error occuerd trying to upload images",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log(fileData);
  }, [fileData]);

  return { fileData, onInputChange, upload, removeFile };
}
