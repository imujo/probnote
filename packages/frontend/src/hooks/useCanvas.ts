import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { useDebounce } from "usehooks-ts";
import { useEffect, useState } from "react";
import { CanvasState } from "utils/excalidraw.global";

const DEBOUNCE_TIME = 500;

export type CanvasOnChange = (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  files: BinaryFiles,
) => void;

export default function useCanvas(putCanvas: (canvas: CanvasState) => void) {
  const [canvas, setCanvas] = useState<CanvasState | null>(null);

  const debouncedCanvas = useDebounce(canvas, DEBOUNCE_TIME);

  const onChange: CanvasOnChange = (elements, appState, files) => {
    setCanvas({
      appState,
      elements,
    });
  };

  useEffect(() => {
    if (!debouncedCanvas) return;

    putCanvas(debouncedCanvas);
  }, [debouncedCanvas]);

  return { onChange };
}
