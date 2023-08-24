import React from "react";
import Breadcrumbs from "./components/Breadcrumbs";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import { LucidePlus } from "lucide-react";
import { DataTable } from "./components/DataTable";
import { Folder, columns } from "./components/Columns";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

const Folders: Folder[] = [
  {
    id: 1,
    label: "Skripta",
    created: "Last month",
    lastUpdated: "2 days ago",
  },
  {
    id: 1,
    label: "Skripta",
    created: "Last month",
    lastUpdated: "2 days ago",
  },
  {
    id: 1,
    label: "Skripta",
    created: "Last month",
    lastUpdated: "2 days ago",
  },
  {
    id: 1,
    label: "Skripta",
    created: "Last month",
    lastUpdated: "2 days ago",
  },
  {
    id: 1,
    label: "Skripta",
    created: "Last month",
    lastUpdated: "2 days ago",
  },
  {
    id: 1,
    label: "Skripta",
    created: "Last month",
    lastUpdated: "2 days ago",
  },
];

async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = params;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-12 flex w-full items-start justify-between">
        <Breadcrumbs className="pt-1" folderId={folderId} />
        <ButtonWithIcon Icon={LucidePlus}>New</ButtonWithIcon>
      </div>
      <DataTable columns={columns} data={Folders} />
    </div>
  );
}

export default FolderPage;
