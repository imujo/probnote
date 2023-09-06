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

type UploadFileProps = {
  url: string;
  file: File;
  onProgress?: (progress: number) => void;
  onSuccess?: () => void;
  onError?: () => void;
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
        if (onError) onError();
        reject(new Error("File upload failed"));
      }
    };

    xhr.onerror = () => {
      if (onError) onError();
      reject(new Error("Network error occurred while uploading the file."));
    };

    xhr.open("PUT", url, true);
    xhr.send(formData);
  });
};

// const onSuccess = async (
//   data: ProblemPost,
//   files: File[],
//   setFileUploadProgress: Dispatch<
//     SetStateAction<{
//       [key: string]: number;
//     } | null>
//   >,
// ) => {
//   const signedUploadUrls = data.data.signedUploadUrls;

//   const promises = files.map((file) => {
//     return uploadFile(
//       signedUploadUrls[file.name].signedUploadUrl,
//       file,
//       setFileUploadProgress,
//     );
//   });

//   return await Promise.all(promises);
// };

// export default function useUploadProblemImages(onSuccess?: () => void) {
//   const { toast } = useToast();
//   return useMutation({
//     mutationFn: ({
//       problemUrls,
//       files,
//     }: {
//       problemUrls: ProblemGetUploadUrls;
//       files: File[];
//     }) => {
//       const signedUploadUrls = problemUrls.data;

//       const promises = files.map((file) => {
//         return uploadFile(signedUploadUrls[file.name].signedUploadUrl, file);
//       });

//       return Promise.all(promises);
//     },
//     onSuccess: async (data) => {
//       toast({
//         title: "Successfully uploaded ",
//       });

//       if (onSuccess) onSuccess();
//     },
//     onError: (err) => {
//       toast({
//         title: "An error occured tying upload",
//         variant: "destructive",
//       });
//     },
//   });
// }
