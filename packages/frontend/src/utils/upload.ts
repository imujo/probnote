import { SignedUploadUrl } from "@probnote/backend/src/utils/upload";
import { Dispatch, SetStateAction } from "react";

export type UploadState =
  | "INITIAL"
  | "GET_UPLOAD_URLS"
  | "UPLOADING"
  | "POSTING_PROBLEMS"
  | "DONE"
  | "ERROR";

export type FileData = {
  file: File;
  state: UploadState;
  fileKey?: string;
  signedUploadUrl?: string;
  progress?: number;
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
        reject();
      }
    };

    xhr.onerror = () => {
      if (onError)
        onError(new Error("Network error occurred while uploading the file."));
      reject();
    };

    xhr.open("PUT", url, true);
    xhr.send(formData);
  });
};

export const setProblemUploadUrls = (
  fileData: FileData[],
  signedUploadUrls: { [key: string]: SignedUploadUrl },
  setFileData: Dispatch<SetStateAction<FileData[] | null>>,
) => {
  try {
    const updatedFileData = [...fileData];

    fileData.forEach((fileDatum, index) => {
      const signedUrlData = signedUploadUrls[fileDatum.file.name];
      if (!signedUrlData) throw new Error("Server didnt return all files");

      updatedFileData[index].fileKey = signedUrlData.fileKey;
      updatedFileData[index].signedUploadUrl = signedUrlData.signedUploadUrl;
      updatedFileData[index].state = "UPLOADING";
    });

    setFileData(updatedFileData);

    return updatedFileData;
  } catch (error) {
    throw error;
  }
};

export const onInitiateUpload = (
  fileData: FileData[],
  setFileData: Dispatch<SetStateAction<FileData[] | null>>,
) => {
  const updatedFileData = [...fileData];

  fileData.forEach((_, index) => {
    updatedFileData[index].state = "GET_UPLOAD_URLS";
  });

  setFileData(updatedFileData);
  return updatedFileData;
};

export const setFileStateDone = (
  fileData: FileData[],
  setFileData: Dispatch<SetStateAction<FileData[] | null>>,
) => {
  const updatedFileData = [...fileData];

  fileData.forEach((_, index) => {
    if (updatedFileData[index].state === "ERROR") return;
    updatedFileData[index].state = "DONE";
  });

  setFileData(updatedFileData);
  return updatedFileData;
};

export const uploadFiles = async (
  fileData: FileData[],
  setFileData: Dispatch<SetStateAction<FileData[] | null>>,
) => {
  const promises = fileData.map(({ file, signedUploadUrl }, index) => {
    if (!signedUploadUrl)
      throw new Error(
        `File with name ${file.name} does not have a pre-signed upload URL`,
      );

    // const url = index !== 2 ? signedUploadUrl : signedUploadUrl + "dsaf";

    return uploadFile({
      url: signedUploadUrl,
      file,
      onProgress: (progress) => {
        const updatedFileData = [...fileData];
        updatedFileData[index].progress = progress;
        setFileData(updatedFileData);
      },
      onSuccess: () => {
        const updatedFileData = [...fileData];
        updatedFileData[index].state = "POSTING_PROBLEMS";
        setFileData(updatedFileData);
      },
      onError: (error) => {
        const updatedFileData = [...fileData];
        updatedFileData[index].state = "ERROR";
        setFileData(updatedFileData);
        // throw error;
      },
    });
  });

  await Promise.all(promises);

  return [...fileData];
};
