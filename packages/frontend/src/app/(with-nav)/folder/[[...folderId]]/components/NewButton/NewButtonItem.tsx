import { ButtonLoading } from "@/components/ButtonLoading";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { Loader2, LucideIcon } from "lucide-react";
import {
  Field,
  FieldValues,
  Path,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { AnyZodObject } from "zod";

interface NewButtonItemProps<T extends FieldValues> {
  form: UseFormReturn<T, any, undefined>;
  menuItemLabel: string;
  MenuItemIcon: LucideIcon;
  dialogTitle: string;
  dialogDescription: string;
  formName: keyof T;
  onSubmit: SubmitHandler<T>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  error: ErrorResponse | null;
}

function NewButtonItem<T extends FieldValues>({
  form,
  MenuItemIcon,
  menuItemLabel,
  dialogTitle,
  dialogDescription,
  formName,
  onSubmit,
  open,
  onOpenChange,
  isLoading,
  error,
}: NewButtonItemProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <MenuItemIcon className="mr-2 h-4 w-4" />
          <span>{menuItemLabel}</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle} </DialogTitle>
          <DialogDescription className="flex flex-col gap-4">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="my-3" onSubmit={(e) => e.preventDefault()}>
            <FormField
              control={form.control}
              name={formName as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="label">Label</FormLabel>
                  <FormControl>
                    <Input id="label" placeholder="Calculus 101" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of your new folder
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="items-center">
          {error ? <p className=" mr-8 text-red-600">{error.message}</p> : null}

          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewButtonItem;
