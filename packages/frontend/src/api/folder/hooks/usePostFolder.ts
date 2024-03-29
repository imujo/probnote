import { FolderPost } from "@probnote/backend/src/components/folder/types.folder";
import { postFolder } from "api/folder/folder.api";
import { useRouter } from "next/navigation";
import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "react-query";
import queryKeys from "utils/queryKeys";
import { FolderItemsGet } from "@probnote/backend/src/components/folderItem/types.folderItem";
import { useToast } from "@/components/ui/use-toast";
import { FolderId } from "../../../utils/types.global";
import { useAuth } from "@clerk/nextjs";
import ResponseError from "utils/ResponseError";
import routesConfig from "@/config/routes.config";

export default function usePostFolder(
  parentFolderId: FolderId,
  onSuccess?: () => void,
) {
  const router = useRouter();

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const getFolderItemsQueryKey = queryKeys.getFolderItems(parentFolderId);
  const { getToken } = useAuth();

  const mutation = useMutation<
    FolderPost,
    ResponseError,
    string,
    {
      previousFolderItems: FolderItemsGet | undefined;
    }
  >({
    mutationFn: (label) =>
      postFolder(
        label,
        parentFolderId === "base" ? null : parentFolderId,
        getToken,
      ),
    onMutate: async (label) => {
      const previousFolderItems = await optimisticallyUpdateFolderItems(
        queryClient,
        getFolderItemsQueryKey,
        label,
      );

      return { previousFolderItems };
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries(getFolderItemsQueryKey);

      router.push(routesConfig.folder(data.data.folderId));
      toast({
        title: "Successfully created folder",
        description: data.message,
      });

      if (onSuccess) onSuccess();
    },
    onError: (err, _, context) => {
      if (context?.previousFolderItems) {
        queryClient.setQueryData(
          getFolderItemsQueryKey,
          context.previousFolderItems,
        );
      }

      toast({
        title: "An error occured tying to create a folder",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return mutation;
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
