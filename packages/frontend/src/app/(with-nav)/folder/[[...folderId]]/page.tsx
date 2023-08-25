"use client";
import React from "react";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import { LucidePlus } from "lucide-react";
import Breadcrumbs from "./components/Breadcrumb/Breadcrumbs";
import { DataTable } from "./components/Folders/DataTable";
import { columns } from "./components/Folders/Columns";
import { useQuery } from "react-query";
import { getFolder } from "apiFunctions/folders.api";
import { FolderChild } from "./components/Folders/Folders.types";
import { FolderGet } from "@probnote/backend/src/components/folder/types.folder";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

function FolderPage({ params }: FolderPageProps) {
  let tempFolderId = params.folderId[0];
  if (isNaN(parseInt(tempFolderId, 10)) && tempFolderId !== "base") return;

  const folderId = tempFolderId as number | "base";

  if (folderId === "base") return;

  const { data, isLoading, isError, isSuccess, error } = useQuery<
    FolderGet,
    ErrorResponse,
    FolderChild[]
  >({
    queryKey: ["folder", folderId],
    queryFn: () => getFolder(folderId),
    select: (data) => {
      const notes: FolderChild[] = data
        ? data?.data.Note.map((note) => {
            return { ...note, type: "note" };
          })
        : [];

      const folders: FolderChild[] = data
        ? data?.data.ChildFolders.map((note) => {
            return { ...note, type: "folder" };
          })
        : [];

      return [...folders, ...notes];
    },
  });

  return (
    <div className="flex h-full flex-col">
      <div className="mb-12 flex w-full items-start justify-between">
        <Breadcrumbs className="pt-1" folderId={folderId} />
        <ButtonWithIcon Icon={LucidePlus}>New</ButtonWithIcon>
      </div>
      <DataTable
        folderId={folderId}
        data={data}
        columns={columns}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
}

export default FolderPage;
