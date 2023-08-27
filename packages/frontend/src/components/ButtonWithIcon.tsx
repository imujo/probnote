import { LucideIcon } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";
import React from "react";

interface ButtonWithIconProps extends ButtonProps {
  Icon: LucideIcon;
  children: string;
}

export const ButtonWithIcon = React.forwardRef<
  HTMLButtonElement,
  ButtonWithIconProps
>(({ Icon, children, ...rest }, ref) => {
  return (
    <Button ref={ref} {...rest}>
      <Icon className="mr-2 h-4 w-4" />
      <span>{children}</span>
    </Button>
  );
});
