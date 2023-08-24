"use client";
import { FC } from "react";
import BreadcrumbItem from "./BreadcrumbItem";
import { cn } from "@/lib/utils";
import { Response } from "express";
import { FolderGetParentsResposne } from "@probnote/backend/src/components/folder/types.folder";
import { useQuery } from "react-query";

interface BreadcrumbsProps {
  className?: string;
  folderId: string;
}

type BodyType<T> = T extends Response<infer U, any> ? U : never;
type Data = BodyType<FolderGetParentsResposne>;

const getBreadcrumbs = async (folderId: string) => {
  const response = await fetch(
    `http://localhost:3001/folder/parents/${folderId}`,
    {
      cache: "no-store",
    },
  );

  return response.json() as Promise<Data>;
};

const Breadcrumbs: FC<BreadcrumbsProps> = ({ className, folderId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["breadcrumbs", folderId],
    queryFn: () => getBreadcrumbs(folderId),
  });

  if (isLoading) return <div>It is loading</div>;
  if (!data) return <div>No breadcrumbs</div>;
  if (isError || data.error) return <div>Error</div>;

  const breadcrumbs = [...data.data];
  breadcrumbs.reverse();

  return (
    <ul className={cn("flex text-xs font-light", className)}>
      <BreadcrumbItem key="base" href={`/folder/base`}>
        Home
      </BreadcrumbItem>
      {breadcrumbs.map((item) => {
        return (
          <BreadcrumbItem href={`/folder/${item.id}`} key={item.id}>
            {item.label}
          </BreadcrumbItem>
        );
      })}
    </ul>
  );
};

export default Breadcrumbs;
