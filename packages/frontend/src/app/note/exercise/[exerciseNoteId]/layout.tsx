"use client";

import ButtonIcon from "@/components/ButtonIcon";
import useProblemId from "hooks/useProblemId";
import { Menu } from "lucide-react";
import { FC, ReactNode, useState } from "react";
import { cn } from "utils/cn";

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
          "fixed right-0 top-0 z-10 h-full w-64 border-l-[1px] border-zinc-200 px-4 py-3 transition-transform ",
          !sideMenuOpen ? "translate-x-[100%]" : null,
        )}
      ></nav>
    </div>
  );
};

export default ExerciseNoteLayout;
