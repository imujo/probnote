import useExerciseNoteId from "hooks/useExerciseNoteId";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";
import { getProblems } from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { ProblemsGet } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";

export default function useGetProblems({
  onSuccess,
}: {
  onSuccess?: (data: ProblemsGet) => void;
}) {
  const exerciseNoteId = useExerciseNoteId();
  const getProblemsQueryKey = queryKeys.getProblems(exerciseNoteId);

  const { getToken } = useAuth();
  const { toast } = useToast();

  return useQuery<ProblemsGet, ResponseError>({
    queryKey: getProblemsQueryKey,
    queryFn: () => getProblems(exerciseNoteId, getToken),
    onSuccess,
    onError: (err) => {
      toast({
        title: "An error occured tying to fetch folder items",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
