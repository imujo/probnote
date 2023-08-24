import { FC } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface BreadcumbErrorProps {
  message: string;
}

const BreadcumbError: FC<BreadcumbErrorProps> = ({ message }) => {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger className=" flex w-[200px] cursor-pointer items-center  gap-1 rounded-full bg-red-100 px-2 py-1  text-xs text-red-900 ">
        <Info className="w-[0.85rem h-[0.85rem]" /> Error
      </HoverCardTrigger>
      <HoverCardContent className="text-xs">{message}</HoverCardContent>
    </HoverCard>
  );
};

export default BreadcumbError;
