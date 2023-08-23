import { FC } from "react";
import SideNavItem from "./SideNavItem";
import SideNavLabel from "./SideNavLabel";
import { LucidePin } from "lucide-react";

interface SideNavProps {}

const SideNav: FC<SideNavProps> = ({}) => {
  return (
    <div className="z-10 box-border flex h-[calc(100vh-64px)]  w-48 flex-col gap-8 border-r-[1px] pt-6 [&_li]:px-6">
      <ul>
        <SideNavLabel>Recent Notes</SideNavLabel>
        <SideNavItem>Nuclear Energy 1</SideNavItem>
        <SideNavItem>Nuclear Energy 2</SideNavItem>
        <SideNavItem>Object Oriented Programming</SideNavItem>
      </ul>
      <ul>
        <SideNavLabel Icon={LucidePin}>Pinned Folders</SideNavLabel>
        <SideNavItem selected>Nuclear Energy 1</SideNavItem>
        <SideNavItem>Nuclear Energy 2</SideNavItem>
        <SideNavItem>Object Oriented Programming</SideNavItem>
      </ul>
    </div>
  );
};

export default SideNav;
