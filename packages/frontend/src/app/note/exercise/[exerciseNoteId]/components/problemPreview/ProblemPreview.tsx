import { FC } from "react";
import Image from "next/image";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "utils/cn";

const problemPreviewVariants = cva(
  " h-[100px] w-full rounded-lg  object-cover ",
  {
    variants: {
      state: {
        default: "brightness-75 border-[1px] border-zinc-200",
        selected: "border-4 border-primary",
        opened: "border-[1px] border-zinc-200",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

interface ProblemPreviewProps
  extends VariantProps<typeof problemPreviewVariants> {
  className?: string;
}

const ProblemPreview: FC<ProblemPreviewProps> = ({ state, className }) => {
  return (
    <Image
      alt="problem_preview"
      src={"/image.png"}
      sizes="20vw"
      width={500}
      height={200}
      className={cn(problemPreviewVariants({ state }), className)}
    />
  );
};

export default ProblemPreview;
