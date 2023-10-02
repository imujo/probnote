"use client";
import { FC, useRef } from "react";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import ExcalidrawCanvas from "../../exercise/[exerciseNoteId]/problem/[[...problemId]]/components/ExcalidrawCanvas";

interface RegularNotePageProps {}

const RegularNotePage: FC<RegularNotePageProps> = ({}) => {
  const excRef = useRef<ExcalidrawImperativeAPI>(null);
  return (
    <ExcalidrawCanvas
      onChange={(
        elements: readonly ExcalidrawElement[],
        appState: AppState,
        files: BinaryFiles,
      ) => {
        console.log(elements);
      }}
      excRef={excRef}
    />
  );
};

export default RegularNotePage;
