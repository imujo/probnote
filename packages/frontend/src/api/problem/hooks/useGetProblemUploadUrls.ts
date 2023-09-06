import { useMutation } from "react-query";
import { getProblemUploadUrls } from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { ProblemGetUploadUrls } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";
import { FileData } from "./useAll";
import { SignedUploadUrl } from "@probnote/backend/src/utils/upload";

export default function useGetProblemUploadUrls(
  onSuccess?: (
    fileData: FileData[],
    uploadUrls: { [key: string]: SignedUploadUrl },
  ) => void,
) {
  const { getToken } = useAuth();
  const { toast } = useToast();

  return useMutation<ProblemGetUploadUrls, ResponseError, FileData[]>({
    mutationFn: (fileData: FileData[]) =>
      getProblemUploadUrls(
        fileData.map((fileDatum) => fileDatum.file.name),
        getToken,
      ),

    onSuccess: async (data, fileData) => {
      toast({
        title: "Successfully got upload urls",
        description: data.message,
      });

      if (onSuccess) onSuccess(fileData, data.data);
    },
    onError: (err) => {
      toast({
        title: "An error occured tying to get urls",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
