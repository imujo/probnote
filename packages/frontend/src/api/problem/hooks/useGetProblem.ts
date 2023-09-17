import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";
import { getProblem } from "../problem.api";
import { useToast } from "@/components/ui/use-toast";
import { ProblemGet } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { CanvasState } from "utils/excalidraw.global";

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
      if (data.data.canvas === null || data.data.canvas === "null") {
        return;
      }

      const objectValue = JSON.parse(data.data.canvas);
      if (
        typeof objectValue.elements !== "object" ||
        typeof objectValue.appState !== "object"
      ) {
        toast({
          title: "Canvas data corrupted",
          description: "Problem canvas data has been corrupted",
          variant: "destructive",
        });
        return;
      }

      const canvas = objectValue as CanvasState;

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
        title: "An error occured tying to fetch problem",
        description: err.message,
        variant: "destructive",
      });
    },
    refetchOnWindowFocus: false,
  });
}
