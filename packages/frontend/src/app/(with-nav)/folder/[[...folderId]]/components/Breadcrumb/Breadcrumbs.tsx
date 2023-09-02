"use client";
import { FC } from "react";
import BreadcrumbItem from "./BreadcrumbItem";
import { cn } from "@/lib/utils";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import BreadcrumbSkeleton from "./BreadcrumbSkeleton";
import { FolderId } from "../../../../../../../types.global";
import ErrorPill from "@/components/ErrorPill";

interface BreadcrumbsProps {
  className?: string;
  folderId: FolderId;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ className, folderId }) => {
  const { isSuccess, isLoading, data, error, isError } =
    useBreadcrumbs(folderId);

  if (isLoading) {
    return <BreadcrumbSkeleton />;
  } else if (isError) {
    return <ErrorPill className="w-40">{error.message}</ErrorPill>;
  } else if (!isSuccess) return;

  const breadcrumbs = data.data.parentFolders;
  const more = data.data.more;

  return (
    <ul className={cn("flex text-xs font-light", className)}>
      <BreadcrumbItem
        key="base"
        href={`/folder/base`}
        last={breadcrumbs.length === 0}
      >
        Home
      </BreadcrumbItem>
      {!!more && (
        <BreadcrumbItem key="more" last={false}>
          ...
        </BreadcrumbItem>
      )}
      {breadcrumbs.map((item, i) => {
        return (
          <BreadcrumbItem
            href={`/folder/${item.folderId}`}
            key={item.folderId}
            last={i === breadcrumbs.length - 1}
          >
            {item.label}
          </BreadcrumbItem>
        );
      })}
    </ul>
  );
};

export default Breadcrumbs;
