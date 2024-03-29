"use client";

import React, { FC, useRef } from "react";
import useGetProblem from "api/problem/hooks/useGetProblem";
import useProblemId from "hooks/useProblemId";
import ProblemImage from "./components/ProblemImage";
import ExcalidrawCanvas from "./components/ExcalidrawCanvas";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import useCanvas from "../../../../../../hooks/useCanvas";
import routesConfig from "@/config/routes.config";
import CanvasActions from "@/components/CanvasActions";
import usePutProblem from "api/problem/hooks/usePutProblem";

interface ProblemPageProps {}

const ProblemPage: FC<ProblemPageProps> = ({}) => {
  const problemId = useProblemId();

  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);
  const query = useGetProblem(
    problemId,
    excalidrawRef,
    () => excalidrawRef.current?.refresh(), // refreshes cursor position
  );
  const {
    mutate: putProblem,
    isLoading,
    isError,
    isSuccess,
  } = usePutProblem(problemId);
  const { onChange } = useCanvas(putProblem);

  return (
    <div className="relative h-[100svh]">
      <CanvasActions
        backRoute={routesConfig.folder(
          query.data?.data.parentFolderId || "base",
        )}
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
      />
      <div className="box-border flex h-64 w-full justify-center border-b-[1px] border-zinc-300 p-2">
        <div className="relative h-full w-full max-w-[80%] ">
          <ProblemImage query={query} />
        </div>
      </div>
      <div className="h-full w-full">
        <ExcalidrawCanvas onChange={onChange} excRef={excalidrawRef} />
      </div>
    </div>
  );
};

export default ProblemPage;
