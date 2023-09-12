import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "react-query";
import { deleteProblemsByFileKeys } from "../problem.api";
import { useToast } from "@/components/ui/use-toast";
import { ProblemsDeleteByFileKeys } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";
import queryKeys from "utils/queryKeys";
import useExerciseNoteId from "hooks/useExerciseNoteId";

export default function useDeleteProblemsByFileKeys() {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const exerciseNoteId = useExerciseNoteId();
  const queryClient = useQueryClient();
  const getProblemsQueryKey = queryKeys.getProblems(exerciseNoteId);

  return useMutation<ProblemsDeleteByFileKeys, ResponseError, string[]>({
    mutationFn: (fileKeys: string[]) =>
      deleteProblemsByFileKeys(fileKeys, getToken),
    onSuccess: (data) => {
      queryClient.invalidateQueries(getProblemsQueryKey);
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
