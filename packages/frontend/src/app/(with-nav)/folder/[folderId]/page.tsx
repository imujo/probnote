"use client";
import React from "react";
import Breadcrumbs from "./components/Breadcrumbs";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import { LucidePlus } from "lucide-react";
import { DataTable } from "./components/DataTable";
import { Payment, columns } from "./components/Columns";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

const payments: Payment[] = [
  {
    id: "1",
    amount: 50,
    status: "pending",
    email: "example1@example.com",
  },
  {
    id: "2",
    amount: 100,
    status: "processing",
    email: "example2@example.com",
  },
  {
    id: "3",
    amount: 75,
    status: "success",
    email: "example3@example.com",
  },
  {
    id: "4",
    amount: 30,
    status: "failed",
    email: "example4@example.com",
  },
  {
    id: "5",
    amount: 200,
    status: "pending",
    email: "example5@example.com",
  },
  {
    id: "5",
    amount: 200,
    status: "pending",
    email: "example5@example.com",
  },
  {
    id: "5",
    amount: 200,
    status: "pending",
    email: "example5@example.com",
  },
  {
    id: "5",
    amount: 200,
    status: "pending",
    email: "example5@example.com",
  },
];

function FolderPage({ params }: FolderPageProps) {
  const { folderId } = params;

  return (
    <div className=" flex h-full flex-col ">
      <div className="mb-12 flex w-full items-start justify-between ">
        <Breadcrumbs className="pt-1" />
        <ButtonWithIcon Icon={LucidePlus}>New</ButtonWithIcon>
      </div>
      <DataTable columns={columns} data={payments} className=" " />
    </div>
  );
}

export default FolderPage;
