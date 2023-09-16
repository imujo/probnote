"use client";

import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import React, { FC, ReactNode, useState } from "react";
import { cn } from "utils/cn";
import { ScrollArea } from "@/components/ui/scroll-area";
import ButtonIcon from "@/components/ButtonIcon";
import AddProblemsModal from "../components/addProblems/AddProblemsModal";
import ProblemPreviewList from "../components/problemPreview/ProblemPreviewList";
import useGetProblemPreview from "../components/problemPreview/useGetProblemPreview";
import useOptionalProblemId from "hooks/useOptionalProblemId";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ExerciseNoteLayoutProps {
  children: ReactNode;
}

const ExerciseNoteLayout: FC<ExerciseNoteLayoutProps> = ({ children }) => {
  const problemId = useOptionalProblemId();
  const [sideMenuOpen, setSideMenuOpen] = useState(true);

  const {
    query,
    onClickNext,
    onClickPrev,
    nextDisabled,
    prevDisabled,
    problemListRef,
  } = useGetProblemPreview();

  return (
    <div className=" h-[100svh]">
      {problemId ? (
        children
      ) : query.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : query.data?.data.problems.length === 0 ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <Image
            alt="empty"
            src="/empty.svg"
            height={250}
            width={250}
            priority
          />
          <h2 className=" text-2xl font-medium text-zinc-800">
            Exercise note is empty
          </h2>
          <p className=" text-zinc-500">
            Add problems with the button in the sidebar to start practicing
          </p>
        </div>
      ) : null}

      <button
        onClick={() => setSideMenuOpen((prev) => !prev)}
        className="fixed right-0 top-0 z-30 my-3 mr-4"
      >
        <Menu />
      </button>
      <nav
        className={cn(
          "fixed right-0 top-0 z-10 flex h-full w-64 flex-col border-l-[1px] border-zinc-200  bg-white pt-16 transition-transform ",
          !sideMenuOpen ? "translate-x-[100%]" : null,
        )}
      >
        <ScrollArea ref={problemListRef} className="flex-1 px-4">
          <ProblemPreviewList query={query} />
        </ScrollArea>
        <div className="flex gap-2 px-4 py-3">
          <ButtonIcon
            disabled={prevDisabled}
            Icon={ChevronLeft}
            onClick={onClickPrev}
          />
          <AddProblemsModal triggerClassName="flex-1" />
          <ButtonIcon
            disabled={nextDisabled}
            Icon={ChevronRight}
            onClick={onClickNext}
          />
        </div>
      </nav>
    </div>
  );
};

export default ExerciseNoteLayout;
