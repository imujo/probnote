import React, { Dispatch, FC, SetStateAction, useMemo } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";

interface ExcalidrawCanvasProps {
  setCanvasState: Dispatch<
    SetStateAction<{
      elements: readonly ExcalidrawElement[];
      appState: AppState;
    }>
  >;
  excRef: React.RefObject<ExcalidrawImperativeAPI>;
}

const ExcalidrawCanvas: FC<ExcalidrawCanvasProps> = ({
  setCanvasState,
  excRef,
}) => {
  const Exc = useMemo(
    () => (
      <Excalidraw
        UIOptions={{
          canvasActions: {
            toggleTheme: false,
          },
        }}
        onChange={(elements, state) =>
          setCanvasState({
            elements: elements,
            appState: state,
          })
        }
        ref={excRef}
      />
    ),
    [],
  );

  return Exc;
};

export default ExcalidrawCanvas;
