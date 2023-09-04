import useSearchFolderItem from "api/folderItem/hooks/useSearchFolderItem";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";

export default function useSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const query = useSearchFolderItem(debouncedSearchQuery);

  const isEmpty =
    !query.isLoading && (!query.data || query.data.data.length === 0);

  return {
    ...query,
    searchQuery,
    setSearchQuery,
    isEmpty,
  };
}
