import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";
import { getProblem } from "../problem.api";
import { useToast } from "@/components/ui/use-toast";
import { ProblemGet } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import validateCanvas from "utils/validateCanvas";

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
      const canvas = validateCanvas(data.data.canvas);
      if (canvas === null) {
        toast({
          title: "Canvas data corrupted",
          description: "Problem canvas data has been corrupted",
          variant: "destructive",
        });
        return;
      }

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
