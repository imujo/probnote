"use client";
import { cn } from "utils/cn";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { FC } from "react";

const breadcrumbItemVariants = cva("hover:text-zinc-800 ", {
  variants: {
    selected: {
      default: "text-zinc-500",
      selected: "text-zinc-800",
    },
    selectable: {
      no: "",
      yes: "hover:underline",
    },
  },
  defaultVariants: {
    selected: "default",
    selectable: "yes",
  },
});

interface BreadcrumbItemProps {
  children: string;
  last?: boolean;
  href?: string;
  className?: string;
}

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({
  children,
  last,
  href,
  className,
}) => {
  return (
    <li className="flex">
      {href ? (
        <Link
          href={href}
          className={cn(
            breadcrumbItemVariants({
              selected: last ? "selected" : "default",
              selectable: "yes",
            }),
            className,
          )}
        >
          {children}
        </Link>
      ) : (
        <div
          className={cn(
            breadcrumbItemVariants({ selected: "default", selectable: "no" }),
            className,
          )}
        >
          {children}
        </div>
      )}

      {!last && <span className="px-1 text-zinc-500">/</span>}
    </li>
  );
};

export default BreadcrumbItem;
