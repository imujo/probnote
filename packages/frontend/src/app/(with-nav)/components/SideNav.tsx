"use client";
import { FC } from "react";
import SideNavItem from "./SideNavItem";
import SideNavLabel from "./SideNavLabel";
import { LucidePin } from "lucide-react";
import useGetPinned from "../hooks/useGetPinned";
import useFolderIdFromParams from "hooks/useFolderIdFromParams";

interface SideNavProps {}

const SideNav: FC<SideNavProps> = ({}) => {
  const {
    data: dataPinned,
    isLoading: isLoadingPinned,
    isError: isErrorPinned,
    isSuccess: isSuccessPinned,
    error: errorPinned,
  } = useGetPinned();

  const folderId = useFolderIdFromParams();

  if (isErrorPinned) {
    return;
  } else if (!isSuccessPinned) return;

  return (
    <div className="z-10 box-border flex h-[calc(100vh-64px)]  w-48 flex-col gap-8 border-r-[1px] pt-6 ">
      <ul>
        <SideNavLabel>Recent Notes</SideNavLabel>
        {/* <SideNavItem>Nuclear Energy 1</SideNavItem>
        <SideNavItem>Nuclear Energy 2</SideNavItem>
        <SideNavItem>Object Oriented Programming</SideNavItem> */}
      </ul>
      <ul>
        <SideNavLabel className="pb-1" Icon={LucidePin}>
          Pinned Folders
        </SideNavLabel>
        {dataPinned.data.map((folder) => {
          return (
            <SideNavItem
              key={folder.id}
              folderId={folder.id}
              selected={folderId == folder.id}
            >
              {folder.label}
            </SideNavItem>
          );
        })}
      </ul>
    </div>
  );
};

export default SideNav;
