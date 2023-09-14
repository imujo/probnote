"use client";

import React, { FC } from "react";
import useGetProblem from "api/problem/hooks/useGetProblem";
import useProblemId from "hooks/useProblemId";
import ProblemImage from "./components/ProblemImage";
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

interface ProblemPageProps {}

const ProblemPage: FC<ProblemPageProps> = ({}) => {
  const problemId = useProblemId();

  const query = useGetProblem(problemId);

  return (
    <div className="h-[100svh]">
      <div className="box-border flex h-64 w-full justify-center border-b-[1px] border-zinc-300 p-2">
        <div className="relative h-full w-full max-w-[80%] ">
          <ProblemImage query={query} />
        </div>
      </div>
      <div className="h-full w-full">
        <Excalidraw
          onChange={(elements: readonly ExcalidrawElement[], state: AppState) =>
            console.log("Elements :", elements, "State : ", state)
          }
        />
      </div>
    </div>
  );
};

export default ProblemPage;
