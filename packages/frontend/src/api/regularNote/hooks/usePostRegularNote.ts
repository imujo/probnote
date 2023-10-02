import { useMutation, useQuery, useQueryClient } from "react-query";
import queryKeys from "utils/queryKeys";
import { postRegularNote } from "../regularNote.api";
import { FolderId } from "utils/types.global";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import routesConfig from "@/config/routes.config";
import { RegularNotePost } from "@probnote/backend/src/components/regularNote/types.regularNote";
import ResponseError from "utils/ResponseError";

export default function usePostRegularNote(
  parentFolderId: FolderId,
  onSuccess?: (data: RegularNotePost) => void,
) {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<RegularNotePost, ResponseError, string>({
    mutationFn: (label: string) =>
      postRegularNote(label, parentFolderId, getToken),
    onSuccess: async (data) => {
      if (onSuccess) onSuccess(data);
      queryClient.invalidateQueries(queryKeys.getFolderItems(parentFolderId));

      // router.push(routesConfig.folder(data.data.folderId));
      toast({
        title: "Successfully created regular note",
        description: data.message,
      });
    },
    onError: (err, _, context) => {
      //   if (context?.previousFolderItems) {
      //     queryClient.setQueryData(
      //       getFolderItemsQueryKey,
      //       context.previousFolderItems,
      //     );
      //   }

      toast({
        title: "An error occured tying to create a regular note",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
