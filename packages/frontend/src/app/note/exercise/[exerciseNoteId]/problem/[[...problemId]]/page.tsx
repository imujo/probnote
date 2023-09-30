"use client";

import React, { FC, useRef } from "react";
import useGetProblem from "api/problem/hooks/useGetProblem";
import useProblemId from "hooks/useProblemId";
import ProblemImage from "./components/ProblemImage";
import ExcalidrawCanvas from "./components/ExcalidrawCanvas";
import ButtonIcon from "@/components/ButtonIcon";
import { ChevronLeftIcon } from "lucide-react";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useRouter } from "next/navigation";
import useCanvas from "./hooks/useCanvas";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorPill from "@/components/ErrorPill";

interface ProblemPageProps {}

const ProblemPage: FC<ProblemPageProps> = ({}) => {
  const problemId = useProblemId();
  const router = useRouter();

  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);
  const query = useGetProblem(problemId, excalidrawRef);
  const { onChange, isError, isLoading, isSuccess } = useCanvas(problemId);

  return (
    <div className="relative h-[100svh]">
      <div className="absolute left-8 top-4 z-50 flex items-center gap-3 rounded bg-white  px-2 py-1">
        <ButtonIcon
          onClick={() =>
            router.push(`/folder/${query.data?.data.parentFolderId || "base"}`)
          }
          Icon={ChevronLeftIcon}
        />

        {isLoading && <LoadingSpinner className="text-zinc-500" />}
        {isError && <span className="text-sm text-red-500">Error</span>}
        {isSuccess && <span className="text-sm text-zinc-500">Saved</span>}
      </div>
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
