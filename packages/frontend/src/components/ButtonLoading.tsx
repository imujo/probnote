import React from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

interface ButtonLoadingProps extends ButtonProps {}

export default function ButtonLoading({ ...rest }: ButtonLoadingProps) {
  return (
    <Button disabled {...rest}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  );
}
