import usePutProblem from "api/problem/hooks/usePutProblem";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { useDebounce } from "usehooks-ts";
import { useEffect, useState } from "react";
import { initialCanvas } from "utils/excalidraw.global";

const DEBOUNCE_TIME = 500;

export type CanvasOnChange = (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  files: BinaryFiles,
) => void;

export default function useCanvas(problemId: number) {
  const [canvas, setCanvas] = useState(initialCanvas);

  const debouncedCanvas = useDebounce(canvas, DEBOUNCE_TIME);

  const {
    mutate: putProblem,
    isLoading,
    isError,
    isSuccess,
  } = usePutProblem(problemId);

  const onChange: CanvasOnChange = (elements, appState, files) => {
    setCanvas({
      appState,
      elements,
    });
  };

  useEffect(() => {
    putProblem({
      canvas: debouncedCanvas,
    });
  }, [debouncedCanvas]);

  return { isLoading, isError, isSuccess, onChange };
}
