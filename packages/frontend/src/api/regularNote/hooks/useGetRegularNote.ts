import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import ResponseError from "utils/ResponseError";
import useRegularNoteId from "hooks/useRegularNoteId";
import { RegularNoteGet } from "@probnote/backend/src/components/regularNote/types.regularNote";
import { getRegularNote } from "../regularNote.api";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import validateCanvas from "utils/validateCanvas";

export default function useGetRegularNote(
  excRef: React.RefObject<ExcalidrawImperativeAPI>,
) {
  const regularNoteId = useRegularNoteId();
  const getRegularNoteQueryKey = queryKeys.getRegularNote(regularNoteId);

  const { getToken } = useAuth();
  const { toast } = useToast();

  return useQuery<RegularNoteGet, ResponseError>({
    queryKey: getRegularNoteQueryKey,
    queryFn: () => getRegularNote(regularNoteId, getToken),
    onSuccess: (data) => {
      const canvas = validateCanvas(data.data.canvas);
      if (canvas === null) {
        toast({
          title: "Canvas data corrupted",
          description: "Regular note canvas data has been corrupted",
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
        title: "An error occured tying to fetch regular note",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
