import { useMutation } from "react-query";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import ResponseError from "utils/ResponseError";
import { CanvasState } from "utils/excalidraw.global";
import { RegularNotePut } from "@probnote/backend/src/components/regularNote/types.regularNote";
import { putRegularNote } from "../regularNote.api";

export default function usePutRegularNote(
  regularNoteId: number,
  onSuccess?: (data: RegularNotePut) => void,
) {
  const { getToken } = useAuth();
  const { toast } = useToast();

  return useMutation<RegularNotePut, ResponseError, CanvasState>({
    mutationFn: (canvas: CanvasState) =>
      putRegularNote(regularNoteId, canvas, getToken),
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      toast({
        title: "Could not update regular note",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
