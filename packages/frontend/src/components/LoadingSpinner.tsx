import { Loader2 } from "lucide-react";
import { FC } from "react";
import { cn } from "utils/cn";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ className }) => {
  return <Loader2 className={cn("mr-2 h-4 w-4 animate-spin", className)} />;
};

export default LoadingSpinner;
