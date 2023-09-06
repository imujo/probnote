import { getProblemUploadUrls, postProblems } from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import { uploadFile } from "./useUploadProblemImages";
import { useEffect, useState } from "react";
import { SignedUploadUrl } from "@probnote/backend/src/utils/upload";

type InitiateUploadProps = {
  fileData: FileData[] | null;
  onSuccess?: (updatedFileData: FileData[]) => void;
  onError?: (error: Error) => void;
};

type UploadFilesProps = {
  fileData: FileData[];
  onSuccess?: (updatedFileData: FileData[]) => void;
  onError?: (error: Error) => void;
};

type SetProblemUploadUrlsProps = {
  fileData: FileData[];
  signedUploadUrls: { [key: string]: SignedUploadUrl };
  onSuccess?: (updatedFileData: FileData[]) => void;
  onError?: (error: Error) => void;
};

export default function useAll() {
  const { getToken } = useAuth();

  const [fileData, setFileData] = useState<FileData[] | null>(null);

  const onInitiateUpload = ({
    onError,
    onSuccess,
    fileData,
  }: InitiateUploadProps) => {
    try {
      if (!fileData) throw new Error("No files selected");
      const updatedFileData = [...fileData];

      fileData.forEach((_, index) => {
        updatedFileData[index].state = "GET_UPLOAD_URLS";
      });

      setFileData(updatedFileData);
      if (onSuccess) onSuccess(updatedFileData);
    } catch (error) {
      if (error instanceof Error) {
        if (onError) {
          onError(error);
          return;
        } else throw error;
      }
    }
  };

  const removeFile = (index: number) => {
    console.log("remove", index, "from", fileData);
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

  const setProblemUploadUrls = ({
    fileData,
    signedUploadUrls,
    onSuccess,
    onError,
  }: SetProblemUploadUrlsProps) => {
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

      if (onSuccess) onSuccess(updatedFileData);
    } catch (error) {
      if (error instanceof Error) {
        if (onError) {
          onError(error);
          return;
        } else throw error;
      }
    }
  };

  const uploadFiles = async ({
    fileData,
    onError,
    onSuccess,
  }: UploadFilesProps) => {
    try {
      const updatedFileData = [...fileData];
      const promises = fileData.map(({ file, signedUploadUrl }, index) => {
        if (!signedUploadUrl)
          throw new Error(
            `File with name ${file.name} does not have a pre-signed upload URL`,
          );

        return uploadFile({
          url: signedUploadUrl,
          file,
          onProgress: (progress) => {
            const updatedFileData = [...fileData];
            updatedFileData[index].progress = progress;
            setFileData(updatedFileData);
          },
          onSuccess: () => {
            updatedFileData[index].state = "POSTING_PROBLEMS";
            setFileData(updatedFileData);
          },
          onError,
        });
      });

      await Promise.all(promises);

      if (onSuccess) onSuccess(updatedFileData);
    } catch (error) {
      if (error instanceof Error) {
        if (onError) {
          onError(error);
          return;
        } else throw error;
      }
    }
  };

  const upload = async (fileData: FileData[] | null) => {
    onInitiateUpload({
      fileData,
      onSuccess: async (fileData) => {
        const { data: signedUploadUrls } = await getProblemUploadUrls(
          fileData.map((fileDatum) => fileDatum.file.name),
          getToken,
        );

        setProblemUploadUrls({
          fileData,
          signedUploadUrls,
          onSuccess: (fileData) => {
            uploadFiles({
              fileData,
              onSuccess: () => {
                console.log("DONE");
              },
            });
          },
        });
      },
    });
  };

  useEffect(() => {
    console.log(fileData);
  }, [fileData]);

  return { fileData, onInputChange, upload, removeFile };
}

export type UploadState =
  | "INITIAL"
  | "GET_UPLOAD_URLS"
  | "UPLOADING"
  | "POSTING_PROBLEMS"
  | "DONE";

// export type UploadData = {
//   [key: string]: {
//     state: UploadState;
//     file: File;
//     fileKey?: string;
//     signedUploadUrl?: string;
//   };
// };

export type Progress = {
  [key: string]: number;
};

export type FileData = {
  file: File;
  state: UploadState;
  fileKey?: string;
  signedUploadUrl?: string;
  progress?: number;
};
