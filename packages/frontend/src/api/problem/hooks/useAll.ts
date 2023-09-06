import { getProblemUploadUrls, postProblems } from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import { uploadFile } from "./useUploadProblemImages";
import { useEffect, useState } from "react";

export default function useAll() {
  const { getToken } = useAuth();

  const [fileData, setFileData] = useState<FileData[] | null>(null);

  const onInitiateUpload = () => {
    if (!fileData) throw new Error("No files selected");

    const updatedFileData = [...fileData];

    fileData.forEach((fileDatum, index) => {
      updatedFileData[index].state = "GET_UPLOAD_URLS";
    });

    setFileData(updatedFileData);
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

  const upload = async () => {
    if (!fileData) return;

    console.log("upload init");

    onInitiateUpload();

    const { data: signedUploadUrls } = await getProblemUploadUrls(
      fileData.map((fileDatum) => fileDatum.file.name),
      getToken,
    );

    console.log("got urls");

    const updatedFileData = [...fileData];

    fileData.forEach((fileDatum, index) => {
      const signedUrlData = signedUploadUrls[fileDatum.file.name];
      if (!signedUrlData) throw new Error("Server didnt return all files");

      updatedFileData[index].fileKey = signedUrlData.fileKey;
      updatedFileData[index].signedUploadUrl = signedUrlData.signedUploadUrl;
      updatedFileData[index].state = "UPLOADING";
    });

    setFileData(updatedFileData);

    console.log("set urls");

    console.log("upload start");

    const promises = updatedFileData.map(({ file, signedUploadUrl }, index) => {
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
          console.log("upload end");

          const updatedFileData = [...fileData];
          updatedFileData[index].state = "POSTING_PROBLEMS";
          setFileData(updatedFileData);
        },
      });
    });

    await Promise.all(promises);
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
