import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";
import { getProblem } from "../problem.api";
import { useToast } from "@/components/ui/use-toast";
import { ProblemGet } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import {
  CanvasState,
  initialAppState,
} from "@/app/note/exercise/[exerciseNoteId]/problem/[[...problemId]]/page";

export default function useGetProblem(
  problemId: number,
  excRef: React.RefObject<ExcalidrawImperativeAPI>,
) {
  const getProblemQueryKey = queryKeys.getProblem(problemId);
  const { getToken } = useAuth();
  const { toast } = useToast();

  return useQuery<ProblemGet, ResponseError>({
    queryKey: getProblemQueryKey,
    queryFn: () => getProblem(problemId, getToken),
    onSuccess: (data) => {
      // @ts-expect-error
      const canvas = data.data.canvas as CanvasState;
      if (!canvas) return;
      console.log(canvas);

      excRef.current?.updateScene({
        elements: canvas.elements,
        appState: {
          ...canvas.appState,
          // @ts-expect-error

          collaborators: [],
        },
      });
    },
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
