import React from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

interface ButtonLoadingProps extends ButtonProps {
  children?: string;
}

export default function ButtonLoading({
  children,
  ...rest
}: ButtonLoadingProps) {
  return (
    <Button disabled {...rest}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {children || "Please wait"}
    </Button>
  );
}
