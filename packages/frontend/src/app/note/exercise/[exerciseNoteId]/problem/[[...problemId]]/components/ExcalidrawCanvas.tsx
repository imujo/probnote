import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Excalidraw,
  exportToCanvas,
  exportToSvg,
  exportToBlob,
} from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types/types";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";
import usePutProblem from "api/problem/hooks/usePutProblem";
import useProblemId from "hooks/useProblemId";
import { Button } from "@/components/ui/button";

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
