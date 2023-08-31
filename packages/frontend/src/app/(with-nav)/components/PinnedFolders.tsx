import { FC } from "react";
import useGetPinned from "../hooks/useGetPinned";
import useFolderIdFromParams from "hooks/useFolderIdFromParams";
import SideNavItem from "./SideNavItem";
import SideNavItemSkeleton from "./SideNavItemSkeleton";

interface PinnedFoldersProps {}

const PinnedFolders: FC<PinnedFoldersProps> = ({}) => {
  const { data, isLoading, isError, isSuccess, error } = useGetPinned();

  const folderId = useFolderIdFromParams();

  if (!folderId) {
    // TODO 404
    return;
  }

  if (isLoading)
    return (
      <>
        <SideNavItemSkeleton />
        <SideNavItemSkeleton />
        <SideNavItemSkeleton />
      </>
    );
  else if (isError)
    return <span className="text-sm text-red-500">{error.message}</span>;
  else if (!isSuccess) return;

  return data.data.map((folder) => {
    return (
      <SideNavItem
        key={folder.id}
        folderId={folder.id}
        selected={folderId == folder.id}
      >
        {folder.label}
      </SideNavItem>
    );
  });
};

export default PinnedFolders;
