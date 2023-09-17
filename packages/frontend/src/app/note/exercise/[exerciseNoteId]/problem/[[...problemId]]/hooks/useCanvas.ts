import usePutProblem from "api/problem/hooks/usePutProblem";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import { useDebounce } from "usehooks-ts";
import { useEffect } from "react";
import { useCustomLocalStorage } from "hooks/useCustomLocalStorage";
import { initialCanvas, CanvasState } from "utils/excalidraw.global";

const DEBOUNCE_TIME = 500;

export type CanvasOnChange = (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  files: BinaryFiles,
) => void;

export default function useCanvas(problemId: number) {
  const [canvas, setCanvas] = useCustomLocalStorage<CanvasState>(
    "canvas",
    initialCanvas,
  );

  const [canvasUpdatedTimestamp, setCanvasUpdatedTimestamp] =
    useCustomLocalStorage("canvasUpdatedTimestamp", 0);

  const [serverUpdatedTimestamp, setServerUpdatedTimestamp] =
    useCustomLocalStorage("serverUpdatedTimestamp", 0);

  const debouncedCanvas = useDebounce(canvas, DEBOUNCE_TIME);

  const {
    mutate: putProblem,
    isLoading,
    isError,
    isSuccess,
  } = usePutProblem(problemId, (data) => {
    setServerUpdatedTimestamp(data.data.canvasUpdatedTimestamp);
  });

  const onChange: CanvasOnChange = (elements, appState, files) => {
    setCanvas({
      appState,
      elements,
    });
    setCanvasUpdatedTimestamp(new Date().getTime());
  };

  useEffect(() => {
    putProblem({
      canvas: debouncedCanvas,
      canvasUpdatedTimestamp: new Date().getTime() - DEBOUNCE_TIME,
    });
  }, [debouncedCanvas]);

  useEffect(() => {
    // console.log({ serverUpdatedTimestamp });
    // console.log({ canvasUpdatedTimestamp });
    // console.log("----");
    console.log(serverUpdatedTimestamp, canvasUpdatedTimestamp);
  }, [serverUpdatedTimestamp, canvasUpdatedTimestamp]);

  return { isLoading, isError, isSuccess, onChange };
}
