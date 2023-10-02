import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import { FolderId } from "utils/types.global";
import { postExerciseNote } from "../exerciseNote.api";
import { useAuth } from "@clerk/nextjs";
import { ExerciseNotePost } from "@probnote/backend/src/components/exerciseNote/types.exerciseNote";
import ResponseError from "utils/ResponseError";
import { useToast } from "@/components/ui/use-toast";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import queryKeys from "utils/queryKeys";
import { useRouter } from "next/navigation";
import routesConfig from "@/config/routes.config";

export default function usePostExerciseNote(
  parentFolderId: FolderId,
  onSuccess?: () => void,
) {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const getFolderItemsQueryKey = queryKeys.getFolderItems(parentFolderId);

  return useMutation<
    ExerciseNotePost,
    ResponseError,
    string,
    {
      previousFolderItems: FolderItemsGet | undefined;
    }
  >({
    mutationFn: (label: string) =>
      postExerciseNote(label, parentFolderId, getToken),

    onMutate: async (newLabel) => {
      const previousFolderItems = await optimisticallyUpdateFolderItems(
        queryClient,
        getFolderItemsQueryKey,
        newLabel,
      );

      return { previousFolderItems };
    },
    onSuccess: (data) => {
      toast({
        title: "Successfully created exercise note",
        description: data.message,
      });

      queryClient.invalidateQueries(getFolderItemsQueryKey);

      if (onSuccess) onSuccess();
      router.push(routesConfig.problem(data.data.exerciseNoteId));
    },
    onError: (err, _, context) => {
      if (context?.previousFolderItems) {
        queryClient.setQueryData(
          getFolderItemsQueryKey,
          context.previousFolderItems,
        );
      }

      toast({
        title: "An error occured tying to create exercise note",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}

async function optimisticallyUpdateFolderItems(
  queryClient: QueryClient,
  getFolderItemsQueryKey: QueryKey,
  newLabel: string,
) {
  await queryClient.cancelQueries({ queryKey: getFolderItemsQueryKey });

  const previousFolderItems = queryClient.getQueryData<FolderItemsGet>(
    getFolderItemsQueryKey,
  );

  if (!previousFolderItems) return;

  const newFolderItemsData = [
    ...previousFolderItems.data,
    {
      label: newLabel,
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
      id: -1,
      Folder: {
        id: -1,
        pinned: false,
      },
      Note: null,
    },
  ];

  queryClient.setQueryData<FolderItemsGet>(getFolderItemsQueryKey, {
    ...previousFolderItems,
    data: newFolderItemsData,
  });

  return previousFolderItems;
}
