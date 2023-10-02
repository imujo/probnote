"use client";

import React from "react";
import useFolderId from "hooks/useFolderId";
import Breadcrumbs from "./components/Breadcrumb/Breadcrumbs";
import columns from "./components/Folders/Columns";
import NewButton from "./components/NewButton/NewButton";
import { DataTable } from "./components/Folders/DataTable";
import useGetFolderItems from "../../../../api/folderItem/hooks/useGetFolderItems";
import { notFound } from "next/navigation";

function FolderPage() {
  const folderId = useFolderId();

  const { data, error, isLoading } = useGetFolderItems(folderId);

  if (error?.status === 404) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-12 flex w-full items-start justify-between">
        <Breadcrumbs className="pt-1" folderId={folderId} />
        <NewButton />
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
