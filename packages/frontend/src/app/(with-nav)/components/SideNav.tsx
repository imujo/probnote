import { FC } from "react";
import SideNavItem from "./SideNavItem";
import SideNavLabel from "./SideNavLabel";
import { LucidePin } from "lucide-react";

interface SideNavProps {}

const SideNav: FC<SideNavProps> = ({}) => {
  return (
    <div className="fixed left-0 top-0 z-10 flex h-screen w-48 flex-col gap-8 border-r-[1px] pt-24 [&_li]:px-6">
      <ul>
        <SideNavLabel>Recent Notes</SideNavLabel>
        <SideNavItem>Nuclear Energy 1</SideNavItem>
        <SideNavItem selected>Nuclear Energy 2</SideNavItem>
        <SideNavItem>Object Oriented Programming</SideNavItem>
      </ul>
      <ul>
        <SideNavLabel Icon={LucidePin}>Pinned Folders</SideNavLabel>
        <SideNavItem>Nuclear Energy 1</SideNavItem>
        <SideNavItem selected>Nuclear Energy 2</SideNavItem>
        <SideNavItem>Object Oriented Programming</SideNavItem>
      </ul>
    </div>
  );
};

export default SideNav;
