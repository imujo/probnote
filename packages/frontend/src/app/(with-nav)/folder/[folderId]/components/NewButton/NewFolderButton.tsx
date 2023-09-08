import React from "react";
import { Folder } from "lucide-react";
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
import useNewFolderButton from "../../hooks/useNewFolderButton";
import useFolderId from "hooks/useFolderId";

export default function NewFolderButton() {
  const folderId = useFolderId();

  const { form, onSubmit, isLoading, dialogOpen, error, setDialogOpen } =
    useNewFolderButton(folderId);

  return (
    <NewButtonItem
      menuItemLabel="Folder"
      MenuItemIcon={Folder}
      dialogTitle="Create a Folder"
      dialogDescription="Add a label and create a new folder"
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
                  This is the name of your new folder
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
