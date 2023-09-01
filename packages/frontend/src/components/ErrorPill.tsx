import { FC } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorPillProps {
  children?: string;
  className?: string;
}

const ErrorPill: FC<ErrorPillProps> = ({ children, className }) => {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger
        className={cn(
          "mx-2 flex items-center gap-1 rounded-full bg-red-100 px-2 py-1  text-xs text-red-900",
          !!children && "cursor-pointer",
          className,
        )}
      >
        <Info className="w-[0.85rem h-[0.85rem]" /> Error
      </HoverCardTrigger>
      {!!children && (
        <HoverCardContent className="text-xs">{children}</HoverCardContent>
      )}
    </HoverCard>
  );
};

export default ErrorPill;
