import React from "react";
import BreadcrumbItem from "./components/BreadcrumbItem";
import Breadcrumbs from "./components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import { LucidePlus } from "lucide-react";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

function FolderPage({ params }: FolderPageProps) {
  const { folderId } = params;

  return (
    <>
      <div className="flex w-full items-start justify-between ">
        <Breadcrumbs className="pt-1" />
        <ButtonWithIcon Icon={LucidePlus}>New</ButtonWithIcon>
      </div>
    </>
  );
}

export default FolderPage;
