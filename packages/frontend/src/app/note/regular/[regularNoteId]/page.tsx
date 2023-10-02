"use client";
import { FC, useRef } from "react";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import ExcalidrawCanvas from "../../exercise/[exerciseNoteId]/problem/[[...problemId]]/components/ExcalidrawCanvas";
import CanvasActions from "@/components/CanvasActions";

interface RegularNotePageProps {}

const RegularNotePage: FC<RegularNotePageProps> = ({}) => {
  const excRef = useRef<ExcalidrawImperativeAPI>(null);
  return (
    <div className="relative h-[100svh]">
      <CanvasActions
        backRoute={""}
        isLoading={false}
        isError={false}
        isSuccess={true}
        className="left-14"
      />

      <div className="h-full w-full">
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
      </div>
    </div>
  );
};

export default RegularNotePage;
