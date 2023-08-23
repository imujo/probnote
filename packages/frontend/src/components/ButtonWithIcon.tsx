import { LucideIcon } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";

interface ButtonWithIconProps extends ButtonProps {
  Icon: LucideIcon;
  children: string;
}

export function ButtonWithIcon({
  Icon,
  children,
  ...rest
}: ButtonWithIconProps) {
  return (
    <Button {...rest}>
      <Icon className="mr-2 h-4 w-4" />
      <span>{children}</span>
    </Button>
  );
}
