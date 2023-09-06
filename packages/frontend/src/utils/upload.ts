import { GetToken } from "@clerk/types";
import { SignedUploadUrl } from "@probnote/backend/src/utils/upload";
import {
  deleteCloudflareFiles,
  getProblemUploadUrls,
  postProblems,
} from "api/problem/problem.api";
import { Dispatch, SetStateAction } from "react";

export type FileDataState =
  | "INITIAL"
  | "GET_UPLOAD_URLS"
  | "UPLOADING"
  | "POSTING_PROBLEMS"
  | "DONE"
  | "ERROR";

export type UploadState = "INITIAL" | "LOADING" | "ERROR" | "DONE";

export type FileData = {
  file: File;
  state: FileDataState;
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

export const uploadFiles = async (
  fileData: FileData[],
  setFileData: Dispatch<SetStateAction<FileData[] | null>>,
  setUploadState: Dispatch<SetStateAction<UploadState>>,
) => {
  const promises = fileData.map(({ file, signedUploadUrl }, index) => {
    if (!signedUploadUrl)
      throw new Error(
        `File with name ${file.name} does not have a pre-signed upload URL`,
      );

    // const url = signedUploadUrl;
    const url =
      index !== 0 ? signedUploadUrl || "test" : signedUploadUrl + "dasfs";

    return uploadFile({
      url,
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
    });
  });

  const updatedFileData = [...fileData];
  await Promise.allSettled(promises).then((values) => {
    values.forEach((value, index) => {
      if (value.status === "rejected") {
        setUploadState("ERROR");
        updatedFileData[index].state = "ERROR";
        setFileData(updatedFileData);
      }
    });
  });

  return updatedFileData;
};

export const setProblemUploadUrls = (
  fileData: FileData[],
  signedUploadUrls: { [key: string]: SignedUploadUrl },
  setFileData: Dispatch<SetStateAction<FileData[] | null>>,
) => {
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
};

export const setFileStateDone = (
  fileData: FileData[],
  setFileData: Dispatch<SetStateAction<FileData[] | null>>,
  setDoneFileData: Dispatch<SetStateAction<FileData[] | null>>,
  setUploadState: Dispatch<SetStateAction<UploadState>>,
) => {
  const errorFileData: FileData[] = fileData.filter(
    (fileDatum) => fileDatum.state === "ERROR",
  );
  const successFileData: FileData[] = fileData
    .filter((fileDatum) => fileDatum.state !== "ERROR")
    .map((fileDatum) => ({ ...fileDatum, state: "DONE" }));

  setUploadState(errorFileData.length !== 0 ? "ERROR" : "DONE");

  setFileData(errorFileData);
  setDoneFileData((prev) =>
    prev === null ? [...successFileData] : [...prev, ...successFileData],
  );
};

export const getProblemUploadUrlsOrError = async (
  fileData: FileData[],
  getToken: GetToken,
  setFileData: Dispatch<SetStateAction<FileData[] | null>>,
  setUploadState: Dispatch<SetStateAction<UploadState>>,
) => {
  try {
    return await getProblemUploadUrls(
      fileData.map(({ file }) => file.name),
      getToken,
    );
  } catch (error) {
    setFileDataState(fileData, setFileData, "ERROR");
    setUploadState("ERROR");

    throw new Error("Could not get upload urls");
  }
};

export const postProblemsOrDeleteUploads = async (
  fileData: FileData[],
  exerciseNoteId: number,
  getToken: GetToken,
  setFileData: Dispatch<SetStateAction<FileData[] | null>>,
  setUploadState: Dispatch<SetStateAction<UploadState>>,
) => {
  const fileDataToPost = fileData.filter(
    (fileDatum) => fileDatum.state !== "ERROR",
  );
  const fileKeysToPost = fileDataToPost.map((fileDatum) => {
    if (!fileDatum.fileKey) throw new Error("Not add files have a file key");
    return fileDatum.fileKey;
  });
  try {
    await postProblems(fileKeysToPost, exerciseNoteId, getToken);
    return fileData;
  } catch (error) {
    await deleteCloudflareFiles(fileKeysToPost, getToken);
    setUploadState("ERROR");
    return setFileDataState(fileData, setFileData, "ERROR");
  }
};

export const setFileDataState = (
  fileData: FileData[],
  setFileData: Dispatch<SetStateAction<FileData[] | null>>,
  state: FileDataState,
) => {
  const updatedFileData = [...fileData];

  fileData.forEach((_, index) => {
    updatedFileData[index].state = state;
  });

  setFileData(updatedFileData);
  return updatedFileData;
};
