import { getPinnedFolders } from "apiFunctions/folders.api";
import { useQuery } from "react-query";
import queryKeys from "utils/queryKeys";

export default function useGetPinned() {
  const queryKey = queryKeys.getPinnedFolders();

  return useQuery({
    queryKey,
    queryFn: getPinnedFolders,
  });
}
