import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { FC } from "react";

const breadcrumbItemVariants = cva("hover:text-zinc-800 hover:underline", {
  variants: {
    selected: {
      default: "text-zinc-500",
      selected: "text-zinc-800",
    },
  },
  defaultVariants: {
    selected: "default",
  },
});

interface BreadcrumbItemProps {
  children: string;
  last?: boolean;
}

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ children, last }) => {
  return (
    <li>
      <Link
        href={"/folder/1"}
        className={cn(
          breadcrumbItemVariants({ selected: last ? "selected" : "default" }),
        )}
      >
        {children}
      </Link>
      {!last && <span className="px-1 text-zinc-500">/</span>}
    </li>
  );
};

export default BreadcrumbItem;
