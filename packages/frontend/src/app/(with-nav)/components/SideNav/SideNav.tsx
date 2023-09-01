"use client";
import { FC } from "react";
import SideNavLabel from "./SideNavLabel";
import { LucidePin } from "lucide-react";
import PinnedFolders from "./PinnedFolders";

interface SideNavProps {}

const SideNav: FC<SideNavProps> = ({}) => {
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
        <PinnedFolders />
      </ul>
    </div>
  );
};

export default SideNav;
