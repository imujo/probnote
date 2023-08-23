import { LucideIcon } from "lucide-react";
import { FC } from "react";

interface SideNavLabelProps {
  children: string;
  Icon?: LucideIcon;
}

const SideNavLabel: FC<SideNavLabelProps> = ({ children, Icon }) => {
  return (
    <li className="mb-1 flex items-center gap-1 text-zinc-700">
      <h4 className="text-xs font-medium">{children}</h4>
      {!!Icon && <Icon className="h-3 w-3" />}
    </li>
  );
};

export default SideNavLabel;
