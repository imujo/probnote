import { useMutation } from "react-query";
import { putProblem } from "../problem.api";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { ProblemPut } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";
import { CanvasState } from "@/app/note/exercise/[exerciseNoteId]/problem/[[...problemId]]/page";

type PutProblemProps = {
  canvas: CanvasState;
  canvasUpdatedTimestamp: number;
};

export default function usePutProblem(problemId: number) {
  const { getToken } = useAuth();
  const { toast } = useToast();

  return useMutation<ProblemPut, ResponseError, PutProblemProps>({
    mutationFn: ({ canvas, canvasUpdatedTimestamp }: PutProblemProps) =>
      putProblem(problemId, canvas, canvasUpdatedTimestamp, getToken),
    onSuccess: (data) => {
      console.log(data);
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
