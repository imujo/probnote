import useExerciseNoteId from "hooks/useExerciseNoteId";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";

import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import ResponseError from "utils/ResponseError";
import useRegularNoteId from "hooks/useRegularNoteId";
import { RegularNoteGet } from "@probnote/backend/src/components/regularNote/types.regularNote";
import { getRegularNote } from "../regularNote.api";

export default function useGetRegularNote(
  {
    //   onSuccess,
    // }: {
    //   onSuccess?: (data: RegularNoteGet) => void;
  },
) {
  const regularNoteId = useRegularNoteId();
  const getRegularNoteQueryKey = queryKeys.getRegularNote(regularNoteId);

  const { getToken } = useAuth();
  const { toast } = useToast();

  return useQuery<RegularNoteGet, ResponseError>({
    queryKey: getRegularNoteQueryKey,
    queryFn: () => getRegularNote(regularNoteId, getToken),
    onError: (err) => {
      toast({
        title: "An error occured tying to fetch regular note",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
