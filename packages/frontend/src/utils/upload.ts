import { GetToken } from "@clerk/types";
import { SignedUploadUrl } from "@probnote/backend/src/components/cloudflare/service.cloudflare";
import {
  deleteCloudflareFiles,
  getUploadUrls,
} from "api/cloudflare/cloudflare.api";
import { postProblems } from "api/problem/problem.api";
import { Dispatch, SetStateAction } from "react";
import axios, { AxiosRequestConfig } from "axios";

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
  return await axios({
    method: "PUT",
    url: url,
    data: file,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100,
        );
        if (onProgress) onProgress(percentCompleted);
      }
    },
  })
    // .then((res) => {
    //   if (onSuccess) onSuccess();
    // })
    .catch((err) => {
      console.log(err);
      if (onError)
        onError(new Error("Network error occurred while uploading the file."));
    });
};

export const uploadFiles = async (
  fileData: FileData[],
  setFileData: Dispatch<SetStateAction<FileData[]>>,
  setUploadState: Dispatch<SetStateAction<UploadState>>,
) => {
  const promises = fileData.map(({ file, signedUploadUrl }, index) => {
    if (!signedUploadUrl)
      throw new Error(
        `File with name ${file.name} does not have a pre-signed upload URL`,
      );

    const url = signedUploadUrl;
    // const url =
    //   index !== 0 ? signedUploadUrl || "test" : signedUploadUrl + "dasfs";

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
  setFileData: Dispatch<SetStateAction<FileData[]>>,
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
  setFileData: Dispatch<SetStateAction<FileData[]>>,
  setDoneFileData: Dispatch<SetStateAction<FileData[]>>,
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

  setDoneFileData((prev) => [...prev, ...successFileData]);
};

export const getProblemUploadUrlsOrError = async (
  fileData: FileData[],
  getToken: GetToken,
  setFileData: Dispatch<SetStateAction<FileData[]>>,
  setUploadState: Dispatch<SetStateAction<UploadState>>,
) => {
  try {
    return await getUploadUrls(
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
  setFileData: Dispatch<SetStateAction<FileData[]>>,
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
  setFileData: Dispatch<SetStateAction<FileData[]>>,
  state: FileDataState,
) => {
  const updatedFileData = [...fileData];

  fileData.forEach((_, index) => {
    updatedFileData[index].state = state;
  });

  setFileData(updatedFileData);

  return updatedFileData;
};
