import { FC, MutableRefObject } from "react";
import Image from "next/image";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "utils/cn";
import useExerciseNoteId from "hooks/useExerciseNoteId";
import Link from "next/link";
import routesConfig from "@/config/routes.config";

const problemPreviewVariants = cva(
  " h-[100px] w-full rounded-lg  object-cover ",
  {
    variants: {
      state: {
        default: "brightness-[0.6] border-[1px] border-zinc-200",
        selected: "border-4 border-primary",
        edited: "border-[1px] border-zinc-200",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

interface ProblemPreviewProps
  extends VariantProps<typeof problemPreviewVariants> {
  id: number;
  url: string;
  className?: string;
  exerciseNoteId: number;
}

const ProblemPreview: FC<ProblemPreviewProps> = ({
  state,
  url,
  id,
  className,
  exerciseNoteId,
}) => {
  return (
    <Link href={routesConfig.problem(exerciseNoteId, id)}>
      <Image
        alt="problem_preview"
        src={url}
        sizes="20vw"
        width={500}
        height={200}
        className={cn(problemPreviewVariants({ state }), className)}
      />
    </Link>
  );
};

export default ProblemPreview;
