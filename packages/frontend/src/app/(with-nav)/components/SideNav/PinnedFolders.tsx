import { FC } from "react";
import useGetPinned from "../../hooks/useGetPinned";
import useFolderIdFromParams from "hooks/useFolderIdFromParams";
import SideNavItem from "./SideNavItem";
import SideNavItemSkeleton from "./SideNavItemSkeleton";
import ErrorPill from "@/components/ErrorPill";

interface PinnedFoldersProps {}

const PinnedFolders: FC<PinnedFoldersProps> = ({}) => {
  const { data, isLoading, isError, isSuccess } = useGetPinned();

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
  else if (isError) return <ErrorPill></ErrorPill>;
  else if (!isSuccess) return;

  return data.data.map((folder) => {
    return (
      <SideNavItem
        key={folder.folderId}
        folderId={folder.folderId}
        selected={folderId == folder.folderId}
      >
        {folder.label}
      </SideNavItem>
    );
  });
};

export default PinnedFolders;
