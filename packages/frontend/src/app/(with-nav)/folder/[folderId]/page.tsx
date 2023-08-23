import React from "react";
import BreadcrumbItem from "./components/BreadcrumbItem";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

function FolderPage({ params }: FolderPageProps) {
  const { folderId } = params;

  return (
    <>
      <ul className="flex text-xs font-light">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Semestar 2</BreadcrumbItem>
        <BreadcrumbItem>Matan 2</BreadcrumbItem>
        <BreadcrumbItem>6.1. Kombinatorika</BreadcrumbItem>
        <BreadcrumbItem last>Skripta</BreadcrumbItem>
      </ul>
    </>
  );
}

export default FolderPage;
