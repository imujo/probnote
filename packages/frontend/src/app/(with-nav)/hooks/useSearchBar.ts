import useSearchFolderItem from "api/folderItem/hooks/useSearchFolderItem";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";

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
