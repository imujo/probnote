import { Loader2 } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";

interface ButtonLoadingProps extends ButtonProps {}

export function ButtonLoading({ ...rest }) {
  return (
    <Button disabled {...rest}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  );
}
