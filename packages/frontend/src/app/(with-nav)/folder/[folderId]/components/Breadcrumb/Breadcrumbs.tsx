"use client";

import React, { FC } from "react";
import { cn } from "utils/cn";
import BreadcrumbItem from "./BreadcrumbItem";
import useBreadcrumbs from "../../../../../../api/breadcrumbs/hooks/useGetBreadcrumbs";
import BreadcrumbSkeleton from "./BreadcrumbSkeleton";
import { FolderId } from "../../../../../../utils/types.global";
import ErrorPill from "@/components/ErrorPill";
import routesConfig from "@/config/routes.config";

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
        href={routesConfig.folder()}
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
            href={routesConfig.folder(item.folderId)}
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
