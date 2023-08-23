import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { FC } from "react";

const sideNavItemVariants = cva(
  "cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap py-3 text-sm hover:text-zinc-900",
  {
    variants: {
      selected: {
        default: "text-zinc-500",
        selected: "text-zinc-900",
      },
    },
    defaultVariants: {
      selected: "default",
    },
  },
);

interface SideNavItemProps {
  children: string;
  selected?: boolean;
}

const SideNavItem: FC<SideNavItemProps> = ({ selected, children }) => {
  return (
    <li
      className={cn(
        sideNavItemVariants({ selected: selected ? "selected" : "default" }),
      )}
    >
      {children}
    </li>
  );
};

export default SideNavItem;
