"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import useGetProblem from "api/problem/hooks/useGetProblem";
import useProblemId from "hooks/useProblemId";
import ProblemImage from "./components/ProblemImage";
import ExcalidrawCanvas from "./components/ExcalidrawCanvas";
import { Button } from "@/components/ui/button";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";
import usePutProblem from "api/problem/hooks/usePutProblem";
import ButtonIcon from "@/components/ButtonIcon";
import { ChevronLeftIcon } from "lucide-react";
import {
  ExcalidrawImperativeAPI,
  AppState,
} from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

export const initialAppState: AppState = {
  isSidebarDocked: false,
  zoom: {
    // @ts-expect-error
    value: 1,
  },
  showWelcomeScreen: false,
  theme: "light",
  // @ts-expect-error
  collaborators: [],
  currentChartType: "bar",
  currentItemBackgroundColor: "transparent",
  currentItemEndArrowhead: "arrow",
  currentItemFillStyle: "hachure",
  currentItemFontFamily: 1,
  currentItemFontSize: 20,
  currentItemOpacity: 100,
  currentItemRoughness: 1,
  currentItemStartArrowhead: null,
  currentItemStrokeColor: "#1e1e1e",
  currentItemRoundness: "round",
  currentItemStrokeStyle: "solid",
  currentItemStrokeWidth: 1,
  currentItemTextAlign: "left",
  cursorButton: "up",
  draggingElement: null,
  editingElement: null,
  editingGroupId: null,
  editingLinearElement: null,
  activeTool: {
    type: "freedraw",
    customType: null,
    locked: false,
    lastActiveTool: null,
  },
  penMode: false,
  penDetected: false,
  errorMessage: null,
  exportBackground: true,
  exportScale: 2,
  exportEmbedScene: false,
  exportWithDarkMode: false,
  fileHandle: null,
  gridSize: null,
  isBindingEnabled: true,
  isLoading: false,
  isResizing: false,
  isRotating: false,
  lastPointerDownWith: "mouse",
  multiElement: null,
  name: "Custom name of drawing",
  contextMenu: null,
  openMenu: null,
  openPopup: null,
  openSidebar: null,
  openDialog: null,
  pasteDialog: { shown: false, data: null },
  previousSelectedElementIds: {},
  resizingElement: null,
  scrolledOutside: false,
  scrollX: 0,
  scrollY: 0,
  selectedElementIds: {},
  selectedGroupIds: {},
  selectionElement: null,
  shouldCacheIgnoreZoom: false,
  showStats: false,
  startBoundElement: null,
  suggestedBindings: [],
  toast: null,
  viewBackgroundColor: "#ffffff",
  zenModeEnabled: false,
  viewModeEnabled: false,
  pendingImageElementId: null,
  showHyperlinkPopup: false,
  selectedLinearElement: null,
  offsetLeft: 58,
  offsetTop: -118.625,
};
export type CanvasState = {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
};
const initialData: CanvasState = {
  elements: [],
  appState: initialAppState,
};

interface ProblemPageProps {}

const ProblemPage: FC<ProblemPageProps> = ({}) => {
  const problemId = useProblemId();

  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);
  const query = useGetProblem(problemId, excalidrawRef);

  const [canvasState, setCanvasState] = useState<CanvasState>(initialData);

  const { mutate: putProblem } = usePutProblem(problemId);

  return (
    <div className="relative h-[100svh]">
      <div className="absolute left-8 top-4 z-50 flex gap-1">
        <ButtonIcon Icon={ChevronLeftIcon} />
        <Button variant="outline" onClick={() => putProblem(canvasState)}>
          Save
        </Button>
      </div>
      <div className="box-border flex h-64 w-full justify-center border-b-[1px] border-zinc-300 p-2">
        <div className="relative h-full w-full max-w-[80%] ">
          <ProblemImage query={query} />
        </div>
      </div>
      <div className="h-full w-full">
        <ExcalidrawCanvas
          setCanvasState={setCanvasState}
          excRef={excalidrawRef}
        />
      </div>
    </div>
  );
};

export default ProblemPage;
