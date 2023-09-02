import React, { FC } from "react";
import useFolderIdFromParams from "hooks/useFolderIdFromParams";
import useGetPinned from "api/folder/hooks/useGetPinned";
import SideNavItem from "./SideNavItem";
import SideNavItemSkeleton from "./SideNavItemSkeleton";
import ErrorPill from "@/components/ErrorPill";

interface PinnedFoldersProps {}

const PinnedFolders: FC<PinnedFoldersProps> = () => {
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
  else if (isError) return <ErrorPill>{error.message}</ErrorPill>;
  else if (!isSuccess) return;

  return data.data.map((folder) => (
    <SideNavItem
      key={folder.folderId}
      folderId={folder.folderId}
      selected={folderId === folder.folderId}
    >
      {folder.label}
    </SideNavItem>
  ));
};

export default PinnedFolders;
