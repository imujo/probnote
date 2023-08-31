import { FolderGetPinned } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { getPinnedFolders } from "apiFunctions/folders.api";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";

export default function useGetPinned() {
  const queryKey = queryKeys.getPinnedFolders();

  return useQuery<FolderGetPinned, ErrorResponse>({
    queryKey,
    queryFn: getPinnedFolders,
  });
}
