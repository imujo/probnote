import useExerciseNoteId from "hooks/useExerciseNoteId";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";
import { CanvasState } from "utils/excalidraw.global";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import ResponseError from "utils/ResponseError";
import useRegularNoteId from "hooks/useRegularNoteId";
import { RegularNoteGet } from "@probnote/backend/src/components/regularNote/types.regularNote";
import { getRegularNote } from "../regularNote.api";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

export default function useGetRegularNote(
  excRef: React.RefObject<ExcalidrawImperativeAPI>,
) {
  // {
  //   onSuccess,
  // }: {
  //   onSuccess?: (data: RegularNoteGet) => void;
  // },
  const regularNoteId = useRegularNoteId();
  const getRegularNoteQueryKey = queryKeys.getRegularNote(regularNoteId);

  const { getToken } = useAuth();
  const { toast } = useToast();

  return useQuery<RegularNoteGet, ResponseError>({
    queryKey: getRegularNoteQueryKey,
    queryFn: () => getRegularNote(regularNoteId, getToken),
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
          description: "Regular note canvas data has been corrupted",
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
        title: "An error occured tying to fetch regular note",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
