import { Button } from "@/components/ui/button";
import { cn } from "utils/cn";
import { LucideIcon } from "lucide-react";
import { FC } from "react";

interface SideNavLabelProps {
  children: string;
  Icon?: LucideIcon;
  className?: string;
}

const SideNavLabel: FC<SideNavLabelProps> = ({ children, Icon, className }) => {
  return (
    <li
      className={cn(
        "mb-1 flex items-center gap-1 px-6 text-zinc-700",
        className,
      )}
    >
      <h4 className="text-xs font-medium">{children}</h4>
      {!!Icon && <Icon className="h-3 w-3" />}
    </li>
  );
};

export default SideNavLabel;
