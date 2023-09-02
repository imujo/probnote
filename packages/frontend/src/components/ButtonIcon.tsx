import React from "react";
import { LucideIcon } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

interface ButtonIconProps extends ButtonProps {
  Icon: LucideIcon;
}

export default function ButtonIcon({ Icon, ...rest }: ButtonIconProps) {
  return (
    <Button variant="outline" size="icon" {...rest}>
      <Icon className="h-4 w-4 text-zinc-500" />
    </Button>
  );
}
