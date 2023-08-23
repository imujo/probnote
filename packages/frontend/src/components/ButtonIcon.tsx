import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ButtonIconProps = {
  Icon: LucideIcon;
};

export function ButtonIcon({ Icon }: ButtonIconProps) {
  return (
    <Button variant="outline" size="icon">
      <Icon className="h-4 w-4 text-zinc-500" />
    </Button>
  );
}
