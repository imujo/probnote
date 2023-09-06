import { getProblemUploadUrls, postProblems } from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import useUploadProblemImages, { uploadFile } from "./useUploadProblemImages";
import { useEffect, useState } from "react";
import { SignedUploadUrl } from "@probnote/backend/src/utils/upload";
import useGetProblemUploadUrls from "./useGetProblemUploadUrls";
import { useToast } from "@/components/ui/use-toast";

type InitiateUploadProps = {
  fileData: FileData[] | null;
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
  const { toast } = useToast();
  const { mutate: getProblemUploadUrls } = useGetProblemUploadUrls(
    (fileData, signedUploadUrls) => {
      setProblemUploadUrls({
        fileData,
        signedUploadUrls,
        onSuccess: (fileData) => {
          uploadFiles(fileData);
        },
      });
    },
  );

  const { mutate: uploadFiles } = useUploadProblemImages({
    onFileError: (error) => {
      toast({
        title: "An error occured uploading a file",
        description: error.message,
        variant: "destructive",
      });
    },
    onFileProgress: (fileData, index, progress) => {
      const updatedFileData = [...fileData];
      updatedFileData[index].progress = progress;
      setFileData(updatedFileData);
    },
    onFileSuccess: (fileData, index) => {
      const updatedFileData = [...fileData];
      updatedFileData[index].state = "POSTING_PROBLEMS";
      setFileData(updatedFileData);
    },
    onSuccess: (fileData) => {
      toast({
        title: "Successfully uploaded files",
        description: "All files are uploaded",
      });
    },
  });

  const [fileData, setFileData] = useState<FileData[] | null>(null);
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

  const upload = async (fileData: FileData[] | null) => {
    onInitiateUpload({
      fileData,
      onSuccess: async (fileData) => {
        getProblemUploadUrls(fileData);
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
