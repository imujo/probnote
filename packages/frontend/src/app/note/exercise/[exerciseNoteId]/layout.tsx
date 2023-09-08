"use client";

import useProblemId from "hooks/useProblemId";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { FC, ReactNode, useState } from "react";
import { cn } from "utils/cn";
import ProblemPreview from "./components/problemPreview/ProblemPreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import ButtonIcon from "@/components/ButtonIcon";
import AddProblemsModal from "./components/addProblems/AddProblemsModal";

interface ExerciseNoteLayoutProps {
  children: ReactNode;
}

const ExerciseNoteLayout: FC<ExerciseNoteLayoutProps> = ({ children }) => {
  const problemId = useProblemId();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  return (
    <div>
      {children}
      <button
        onClick={() => setSideMenuOpen((prev) => !prev)}
        className="fixed right-0 top-0 z-30 my-3 mr-4"
      >
        <Menu />
      </button>
      <nav
        className={cn(
          "fixed right-0 top-0 z-10 flex h-full w-64 flex-col border-l-[1px]  border-zinc-200 pt-16 transition-transform ",
          !sideMenuOpen ? "translate-x-[100%]" : null,
        )}
      >
        <ScrollArea className="flex-1 px-4">
          <ProblemPreview className="mb-6" state="opened" />
          <ProblemPreview className="mb-6" state="opened" />
          <ProblemPreview className="mb-6" state="selected" />
          <ProblemPreview className="mb-6" />
          <ProblemPreview className="mb-6" />
          <ProblemPreview className="mb-6" />
          <ProblemPreview className="mb-6" />
          <ProblemPreview className="mb-6" />
          <ProblemPreview className="mb-6" />
          <ProblemPreview className="mb-6" />
          <ProblemPreview className="mb-6" />
          <ProblemPreview className="mb-6" />
        </ScrollArea>
        <div className="flex gap-2 px-4 py-3">
          <ButtonIcon Icon={ChevronLeft} />
          <AddProblemsModal triggerClassName="flex-1" />
          <ButtonIcon Icon={ChevronRight} />
        </div>
      </nav>
    </div>
  );
};

export default ExerciseNoteLayout;
