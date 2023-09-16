import { useMutation } from "react-query";
import { putProblem } from "../problem.api";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { ProblemPut } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";

export default function usePutProblem(problemId: number) {
  const { getToken } = useAuth();
  const { toast } = useToast();

  return useMutation<ProblemPut, ResponseError, ImportedDataState>({
    mutationFn: (canvas: ImportedDataState) =>
      putProblem(problemId, canvas, getToken),
    onSuccess: (data) => {
      toast({
        title: "Problem updated",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Could not update problem",
        description: error.message,
      });
    },
  });
}
