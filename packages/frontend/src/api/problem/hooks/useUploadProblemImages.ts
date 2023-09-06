import { useAuth } from "@clerk/nextjs";
import {
  ProblemGetUploadUrls,
  ProblemPost,
  problemGetUploadUrlsSchema,
} from "@probnote/backend/src/components/problem/types.problem";
import usePostProblems from "api/problem/hooks/usePostProblems";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { getProblemUploadUrls } from "../problem.api";
import { useToast } from "@/components/ui/use-toast";
import { FileData } from "./useAll";

export type UploadFilesProps = {
  fileData: FileData[];
  onFileSuccess?: (fileData: FileData[], index: number) => void;
  onFileProgress?: (
    fileData: FileData[],
    index: number,
    progress: number,
  ) => void;
  onFileError?: (error: Error) => void;
};

type UploadFileProps = {
  url: string;
  file: File;
  onProgress?: (progress: number) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const uploadFile = async ({
  url,
  file,
  onProgress,
  onSuccess,
  onError,
}: UploadFileProps) => {
  const formData = new FormData();
  formData.append("file", file);

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded / event.total) * 100);
        if (onProgress) onProgress(percentCompleted);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        if (onSuccess) onSuccess();
        resolve();
      } else {
        if (onError) onError(new Error("File upload failed"));
        reject(new Error("File upload failed"));
      }
    };

    xhr.onerror = () => {
      if (onError)
        onError(new Error("Network error occurred while uploading the file."));
      reject(new Error("Network error occurred while uploading the file."));
    };

    xhr.open("PUT", url, true);
    xhr.send(formData);
  });
};

const uploadFiles = async ({
  fileData,
  onFileError,
  onFileSuccess,
  onFileProgress,
}: UploadFilesProps) => {
  const promises = fileData.map(({ file, signedUploadUrl }, index) => {
    if (!signedUploadUrl)
      throw new Error(
        `File with name ${file.name} does not have a pre-signed upload URL`,
      );

    return uploadFile({
      url: signedUploadUrl,
      file,
      onProgress: (progress) =>
        onFileProgress && onFileProgress(fileData, index, progress),
      onSuccess: () => onFileSuccess && onFileSuccess(fileData, index),
      onError: onFileError,
    });
  });

  await Promise.all(promises);
};

type UseUploadProblemImagesProps = {
  onFileError: (error: Error) => void;
  onFileSuccess: (fileData: FileData[], index: number) => void;
  onFileProgress: (
    fileData: FileData[],
    index: number,
    progress: number,
  ) => void;
  onSuccess: (fileData: FileData[]) => void;
};

export default function useUploadProblemImages({
  onFileSuccess,
  onFileError,
  onFileProgress,
  onSuccess,
}: UseUploadProblemImagesProps) {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (fileData: FileData[]) =>
      uploadFiles({ fileData, onFileSuccess, onFileError, onFileProgress }),
    onSuccess: async (data, fileData) => {
      toast({
        title: "Successfully uploaded ",
      });

      if (onSuccess) onSuccess(fileData);
    },
    onError: (err) => {
      toast({
        title: "An error occured tying upload",
        variant: "destructive",
      });
    },
  });
}
