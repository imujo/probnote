import React from "react";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

function FolderPage({ params }: FolderPageProps) {
  const { folderId } = params;

  return <div>{folderId}</div>;
}

export default FolderPage;
