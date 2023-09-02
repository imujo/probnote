"use client";

import React from "react";
import useFolderIdFromParams from "hooks/useFolderIdFromParams";
import useFolders from "../../../../api/folderItem/hooks/useGetFolderItems";
import Breadcrumbs from "./components/Breadcrumb/Breadcrumbs";
import columns from "./components/Folders/Columns";
import NewButton from "./components/NewButton/NewButton";
import { DataTable } from "./components/Folders/DataTable";

function FolderPage() {
  const folderId = useFolderIdFromParams();

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
