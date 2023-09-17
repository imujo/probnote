import { useMutation } from "react-query";
import { putProblem } from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { ProblemPut } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";
import { CanvasState } from "utils/excalidraw.global";

type PutProblemProps = {
  canvas: CanvasState;
  canvasUpdatedTimestamp: number;
};

export default function usePutProblem(
  problemId: number,
  onSuccess?: (data: ProblemPut) => void,
) {
  const { getToken } = useAuth();
  const { toast } = useToast();

  return useMutation<ProblemPut, ResponseError, PutProblemProps>({
    mutationFn: ({ canvas, canvasUpdatedTimestamp }: PutProblemProps) =>
      putProblem(problemId, canvas, canvasUpdatedTimestamp, getToken),
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      toast({
        title: "Problem updated",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Could not update problem",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
