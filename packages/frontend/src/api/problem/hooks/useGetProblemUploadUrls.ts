import { useMutation } from "react-query";
import { getProblemUploadUrls } from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { ProblemGetUploadUrls } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";

export default function useGetProblemUploadUrls(
  onSuccess?: (data: ProblemGetUploadUrls) => void,
) {
  const { getToken } = useAuth();
  const { toast } = useToast();

  return useMutation<ProblemGetUploadUrls, ResponseError, string[]>({
    mutationFn: (filenames: string[]) =>
      getProblemUploadUrls(filenames, getToken),

    onSuccess: async (data) => {
      toast({
        title: "Successfully got upload urls",
        description: data.message,
      });

      if (onSuccess) onSuccess(data);
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
