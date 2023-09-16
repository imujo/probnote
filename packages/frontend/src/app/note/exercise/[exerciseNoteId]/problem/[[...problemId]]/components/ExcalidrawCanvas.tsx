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
  setCanvasState: Dispatch<SetStateAction<ImportedDataState>>;
}

const ExcalidrawCanvas: FC<ExcalidrawCanvasProps> = ({ setCanvasState }) => {
  const Exc = useMemo(
    () => (
      <Excalidraw
        onChange={(elements: readonly ExcalidrawElement[], state: AppState) =>
          setCanvasState({
            elements: elements,
            appState: state,
          })
        }
      />
    ),
    [],
  );

  return Exc;
};

export default ExcalidrawCanvas;
