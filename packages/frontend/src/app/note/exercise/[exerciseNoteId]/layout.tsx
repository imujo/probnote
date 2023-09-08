"use client";

import useProblemId from "hooks/useProblemId";
import { Menu } from "lucide-react";
import { FC, ReactNode, useState } from "react";
import { cn } from "utils/cn";
import ProblemPreview from "./components/problemPreview/ProblemPreview";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          "fixed right-0 top-0 z-10 h-full w-64 border-l-[1px]  border-zinc-200 pt-16 transition-transform ",
          !sideMenuOpen ? "translate-x-[100%]" : null,
        )}
      >
        <ScrollArea className="h-full px-4">
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
      </nav>
    </div>
  );
};

export default ExerciseNoteLayout;
