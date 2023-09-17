"use client";

import React, { FC, useRef, useState } from "react";
import useGetProblem from "api/problem/hooks/useGetProblem";
import useProblemId from "hooks/useProblemId";
import ProblemImage from "./components/ProblemImage";
import ExcalidrawCanvas from "./components/ExcalidrawCanvas";
import { Button } from "@/components/ui/button";
import usePutProblem from "api/problem/hooks/usePutProblem";
import ButtonIcon from "@/components/ButtonIcon";
import { ChevronLeftIcon } from "lucide-react";
import {
  ExcalidrawImperativeAPI,
  AppState,
} from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { initialAppState } from "utils/excalidraw.global";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);
  const query = useGetProblem(problemId, excalidrawRef);

  const [canvasState, setCanvasState] = useState<CanvasState>(initialData);

  const { mutate: putProblem } = usePutProblem(problemId);

  return (
    <div className="relative h-[100svh]">
      <div className="absolute left-8 top-4 z-50 flex gap-1">
        <ButtonIcon
          onClick={() =>
            router.push(`/folder/${query.data?.data.parentFolderId || "base"}`)
          }
          Icon={ChevronLeftIcon}
        />
        <Button
          variant="outline"
          onClick={() =>
            putProblem({
              canvas: canvasState,
              canvasUpdatedTimestamp: new Date().getTime(),
            })
          }
        >
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
