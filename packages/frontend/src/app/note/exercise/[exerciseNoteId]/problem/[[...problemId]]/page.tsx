"use client";
import useGetProblem from "api/problem/hooks/useGetProblem";
import useProblemId from "hooks/useProblemId";
import Image from "next/image";
import { FC } from "react";
import ProblemImage from "./components/ProblemImage";

interface ProblemPageProps {}

const ProblemPage: FC<ProblemPageProps> = ({}) => {
  const problemId = useProblemId();

  const query = useGetProblem(problemId);

  return (
    <div>
      <div className="box-border flex h-64 w-full justify-center border-b-[1px] border-zinc-300 p-2">
        <div className="relative h-full w-full max-w-[80%] ">
          <ProblemImage query={query} />
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
