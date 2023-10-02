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
import usePutRegularNote from "api/regularNote/hooks/usePutRegularNote";
import useRegularNoteId from "hooks/useRegularNoteId";
import useCanvas from "hooks/useCanvas";
import useGetRegularNote from "api/regularNote/hooks/useGetRegularNote";
import routesConfig from "@/config/routes.config";

interface RegularNotePageProps {}

const RegularNotePage: FC<RegularNotePageProps> = ({}) => {
  const excRef = useRef<ExcalidrawImperativeAPI>(null);
  const regularNoteId = useRegularNoteId();

  const { data: regularNote } = useGetRegularNote(excRef);

  const {
    mutate: putRegularNote,
    isLoading,
    isError,
    isSuccess,
  } = usePutRegularNote(regularNoteId);
  const { onChange } = useCanvas(putRegularNote);

  return (
    <div className="relative h-[100svh]">
      <CanvasActions
        backRoute={routesConfig.folder(
          regularNote?.data.parentFolderId || "base",
        )}
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
        className="left-14"
      />

      <div className="h-full w-full">
        <ExcalidrawCanvas onChange={onChange} excRef={excRef} />
      </div>
    </div>
  );
};

export default RegularNotePage;
