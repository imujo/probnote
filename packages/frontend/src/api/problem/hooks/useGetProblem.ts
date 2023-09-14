import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";
import { getProblem } from "../problem.api";
import { useToast } from "@/components/ui/use-toast";
import { ProblemGet } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";

export default function useGetProblem(problemId: number) {
  const getProblemQueryKey = queryKeys.getProblem(problemId);
  const { getToken } = useAuth();
  const { toast } = useToast();

  return useQuery<ProblemGet, ResponseError>({
    queryKey: getProblemQueryKey,
    queryFn: () => getProblem(problemId, getToken),
    onError: (err) => {
      toast({
        title: "An error occured tying to fetch folder items",
        description: err.message,
        variant: "destructive",
      });
    },
    refetchOnWindowFocus: false,
  });
}
