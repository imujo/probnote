import { FC } from "react";
import ButtonIcon from "./ButtonIcon";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { cn } from "utils/cn";

interface CanvasActionsProps {
  backRoute: string;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  className?: string;
}

const CanvasActions: FC<CanvasActionsProps> = ({
  backRoute,
  isError,
  isLoading,
  isSuccess,
  className,
}) => {
  const router = useRouter();
  return (
    <div
      className={cn(
        "absolute left-8 top-4 z-50 flex items-center gap-3 rounded bg-white px-2 py-1",
        className,
      )}
    >
      <ButtonIcon
        onClick={() => router.push(backRoute)}
        Icon={ChevronLeftIcon}
      />

      {isLoading && <LoadingSpinner className="text-zinc-500" />}
      {isError && <span className="text-sm text-red-500">Error</span>}
      {isSuccess && <span className="text-sm text-zinc-500">Saved</span>}
    </div>
  );
};

export default CanvasActions;
