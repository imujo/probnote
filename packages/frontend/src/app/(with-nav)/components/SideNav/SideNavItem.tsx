import React, { FC } from "react";
import usePinFolder from "api/folder/hooks/usePinFolder";
import { cn } from "utils/cn";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import Link from "next/link";
import useFolderIdFromParams from "hooks/useFolderIdFromParams";
import { FolderId } from "../../../../utils/types.global";
import ButtonIcon from "@/components/ButtonIcon";

const sideNavItemVariants = cva(
  "cursor-pointer overflow-hidden px-6 flex-1 flex items-center hover:bg-zinc-50 text-ellipsis whitespace-nowrap py-2 text-sm hover:text-zinc-900 ",
  {
    variants: {
      selected: {
        default: "text-zinc-500",
        selected: "text-zinc-900 bg-zinc-50",
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
  folderId: FolderId;
}

const SideNavItem: FC<SideNavItemProps> = ({
  selected,
  children,
  folderId,
}) => {
  const currentFolderId = useFolderIdFromParams();

  const { mutate: pinFolder, isLoading } = usePinFolder(
    folderId as number, // cannot be base
    currentFolderId as FolderId, // cannot be undefined
  );

  return (
    <li className="group relative flex">
      <Link
        href={`/folder/${folderId}`}
        className={cn(
          sideNavItemVariants({ selected: selected ? "selected" : "default" }),
          " inline-block",
        )}
      >
        {children}
      </Link>

      <ButtonIcon
        Icon={X}
        variant="ghost"
        onClick={() => pinFolder({ pinStatus: false, label: "" })}
        disabled={isLoading}
        className="absolute right-2 top-1/2 h-4 w-4 translate-y-[-50%] p-[2px] opacity-0 transition-opacity   duration-200 group-hover:opacity-100 "
      />
    </li>
  );
};

export default SideNavItem;
