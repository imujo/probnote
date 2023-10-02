import { CanvasState } from "./excalidraw.global";

function validateCanvas(canvas: string) {
  if (canvas === null || canvas === "null") {
    return null;
  }

  const objectValue = JSON.parse(canvas);
  if (
    typeof objectValue.elements !== "object" ||
    typeof objectValue.appState !== "object"
  ) {
    return null;
  }

  return objectValue as CanvasState;
}

export default validateCanvas;
