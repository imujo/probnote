import React from "react";
import { File, Folder } from "lucide-react";
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
import NewButtonItem from "./NewButtonItem";
import useFolderId from "hooks/useFolderId";
import useNewExerciseNoteButton from "../../hooks/useNewExerciseNoteButton";
import useNewRegularNoteButton from "../../hooks/useNewRegularNote";

export default function NewRegularNoteButton() {
  const folderId = useFolderId();

  const { form, onSubmit, isLoading, dialogOpen, error, setDialogOpen } =
    useNewRegularNoteButton(folderId);

  return (
    <NewButtonItem
      menuItemLabel="Regular Note"
      MenuItemIcon={File}
      dialogTitle="Create an Regular Note"
      dialogDescription="Add a label and create a new regular note"
      onSubmit={onSubmit}
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      isLoading={isLoading}
      error={error}
    >
      <Form {...form}>
        <form className="my-3" onSubmit={(e) => e.preventDefault()}>
          <FormField
            control={form.control}
            name={"label"}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="label">Label</FormLabel>
                <FormControl>
                  <Input id="label" placeholder="Calculus 101" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of your new regular note
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </NewButtonItem>
  );
}
