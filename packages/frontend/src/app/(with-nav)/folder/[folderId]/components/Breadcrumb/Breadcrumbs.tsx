"use client";
import { FC } from "react";
import BreadcrumbItem from "./BreadcrumbItem";
import { cn } from "@/lib/utils";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import BreadcrumbSkeleton from "./Breadcrumb.skeleton";

interface BreadcrumbsProps {
  className?: string;
  folderId: string;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ className, folderId }) => {
  const { isLoading, isError, data } = useBreadcrumbs(parseInt(folderId, 10));

  if (isLoading) return <BreadcrumbSkeleton />;
  if (!data) return <div>No breadcrumbs</div>;
  if (isError) return <div>Error</div>;

  return (
    <ul className={cn("flex text-xs font-light", className)}>
      <BreadcrumbItem key="base" href={`/folder/base`}>
        Home
      </BreadcrumbItem>
      {data.data.map((item, i) => {
        return (
          <BreadcrumbItem
            href={`/folder/${item.id}`}
            key={item.id}
            last={i === data.data.length - 1}
          >
            {item.label}
          </BreadcrumbItem>
        );
      })}
    </ul>
  );
};

export default Breadcrumbs;
