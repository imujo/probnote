"use client";

import React, { FC, useState } from "react";
import useGetProblem from "api/problem/hooks/useGetProblem";
import useProblemId from "hooks/useProblemId";
import ProblemImage from "./components/ProblemImage";
import ExcalidrawCanvas from "./components/ExcalidrawCanvas";
import { Button } from "@/components/ui/button";
import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";
import usePutProblem from "api/problem/hooks/usePutProblem";
import ButtonIcon from "@/components/ButtonIcon";
import { ChevronLeftIcon } from "lucide-react";

const initialData: ImportedDataState = {
  elements: [],
  appState: { viewBackgroundColor: "#AFEEEE", currentItemFontFamily: 1 },
  scrollToContent: true,
};

interface ProblemPageProps {}

const ProblemPage: FC<ProblemPageProps> = ({}) => {
  const problemId = useProblemId();

  const query = useGetProblem(problemId);

  const [canvasState, setCanvasState] =
    useState<ImportedDataState>(initialData);

  const { mutate: putProblem } = usePutProblem(problemId);

  return (
    <div className="relative h-[100svh]">
      <div className="absolute left-8 top-4 flex gap-1">
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
        <ExcalidrawCanvas setCanvasState={setCanvasState} />
      </div>
    </div>
  );
};

export default ProblemPage;
