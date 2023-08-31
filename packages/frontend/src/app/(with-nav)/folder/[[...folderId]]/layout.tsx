"use client";
import React from "react";
import { FolderContextProvider } from "./context/FolderContext";

export default function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FolderContextProvider>{children}</FolderContextProvider>;
}
