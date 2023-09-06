import { useMutation } from "react-query";
import { postProblems } from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import { ProblemPost } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";
import { useToast } from "@/components/ui/use-toast";

export default function usePostProblems(exerciseNoteId: number) {
  const { getToken } = useAuth();
  const { toast } = useToast();

  return useMutation<ProblemPost, ResponseError, string[]>({
    mutationFn: (problemFileKeys: string[]) =>
      postProblems(problemFileKeys, exerciseNoteId, getToken),

    onSuccess: async (data) => {
      toast({
        title: "Successfully created problems",
        description: data.message,
      });
    },
    onError: (err) => {
      toast({
        title: "An error occured tying to create problems",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
