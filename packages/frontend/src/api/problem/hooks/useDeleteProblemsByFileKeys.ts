import { useAuth } from "@clerk/nextjs";
import { useMutation } from "react-query";
import { deleteProblemsByFileKeys } from "../problem.api";
import { useToast } from "@/components/ui/use-toast";
import { ProblemsDeleteByFileKeys } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";

export default function useDeleteProblemsByFileKeys() {
  const { getToken } = useAuth();
  const { toast } = useToast();

  return useMutation<ProblemsDeleteByFileKeys, ResponseError, string[]>({
    mutationFn: (fileKeys: string[]) =>
      deleteProblemsByFileKeys(fileKeys, getToken),
    onSuccess: (data) => {
      toast({
        title: "Successfully deleted",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "An error occured deleting problems",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
