"use client";
import React, { useEffect } from "react";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import { LucidePlus, MoreVertical } from "lucide-react";
import Breadcrumbs from "./components/Breadcrumb/Breadcrumbs";
import { DataTable } from "./components/Folders/DataTable";
import { columns } from "./components/Folders/Columns";
import useFolders from "../../../../api/folderItem/hooks/useGetFolderItems";
import NewButton from "./components/NewButton/NewButton";
import { FolderId } from "../../../../utils/types.global";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

function FolderPage({ params }: FolderPageProps) {
  let tempFolderId = params.folderId[0];
  if (isNaN(parseInt(tempFolderId, 10)) && tempFolderId !== "base") return;

  const folderId = tempFolderId as FolderId;

  const { data, error, isLoading } = useFolders(folderId);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-12 flex w-full items-start justify-between">
        <Breadcrumbs className="pt-1" folderId={folderId} />
        <NewButton folderId={folderId} />
      </div>
      <DataTable
        data={data?.data}
        columns={columns}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
}

export default FolderPage;
