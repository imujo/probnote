import React from "react";
import BreadcrumbItem from "./components/BreadcrumbItem";
import Breadcrumbs from "./components/Breadcrumbs";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

function FolderPage({ params }: FolderPageProps) {
  const { folderId } = params;

  return (
    <>
      <Breadcrumbs />
    </>
  );
}

export default FolderPage;
