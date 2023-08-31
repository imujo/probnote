"use client";
import { FC, useEffect } from "react";
import BreadcrumbItem from "./BreadcrumbItem";
import { cn } from "@/lib/utils";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import BreadcrumbSkeleton from "./BreadcrumbSkeleton";
import BreadcumbError from "./BreadcumbError";
import { FolderId } from "../../../../../../../types.global";
import { useFolderContext } from "../../context/FolderContext";

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
    return <BreadcumbError message={error.message} />;
  } else if (!isSuccess) return;

  const breadcrumbs = data.data.parentFolders;
  const more = data.data.more;
  console.log(more);

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
            href={`/folder/${item.id}`}
            key={item.id}
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
