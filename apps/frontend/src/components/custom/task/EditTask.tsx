import api from "@/app/api";
import { store } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Priority } from "@/enums/priority";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendarDue, IconCheck, IconSelector } from "@tabler/icons-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";

const EditTaskSchema = z.object({
  name: z.string().trim().min(3).max(20).optional(),
  description: z.string().trim().min(1).max(3000).optional(),
  dueAt: z.date().optional(),
  priority: z.nativeEnum(Priority).optional(),
  listId: z.string().optional(),
});

const EditTask = (props: { open: boolean; close: () => void; taskId: string }) => {
  const { open, close, taskId } = props;

  const { toast } = useToast();

  const [openDateSelector, setOpenDateSelector] = useState(false);
  const [openPrioritySelector, setOpenPrioritySelector] = useState(false);
  const [openListSelector, setOpenListSelector] = useState(false);

  const form = useForm<z.infer<typeof EditTaskSchema>>({ resolver: zodResolver(EditTaskSchema), mode: "onChange" });

  useEffect(() => form.reset(), [open]);

  const updateTask = store((state) => state.updateTask);

  const priorities = Object.keys(Priority);

  const retrieveTask = store((state) => state.getTask(taskId));
  const lists = store((state) => state.getLists());

  async function onSubmit(data: z.infer<typeof EditTaskSchema>) {
    const { dueAt, ...restData } = data;
    const preparedDueAt = dueAt ? new Date(dueAt).toISOString() : undefined;

    const request = await api.PATCH("/boards/{boardId}/lists/{listId}/tasks/{id}", {
      body: { ...restData, dueAt: preparedDueAt },
      params: { path: { listId: retrieveTask.listId, id: taskId, boardId: retrieveTask.boardId } },
    });

    if (request.data) {
      const { data } = request;

      toast({
        title: "Task updated",
        description: (
          <p>
            Task <b>{data.name}</b> successfully updated.
          </p>
        ),
      });

      updateTask(data);

      close();
    } else {
      if (!request.error) {
        toast({ title: "Something went wrong", description: "Please try again later 😭", variant: "destructive" });

        return;
      }

      const { error } = request;

      toast({
        title: error.error ?? "Something went wrong",
        description: typeof error.message === "string" ? error.message : error.message.join(", "),
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col justify-between space-y-4">
            <div className="flex flex-col space-y-4">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal">Name</FormLabel>
                      <Input
                        type="text"
                        defaultValue={retrieveTask.name}
                        onInput={field.onChange}
                        onChange={() => field.value}
                      />
                      <FormMessage className="font-normal" />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal">Description</FormLabel>
                      <Textarea
                        defaultValue={retrieveTask.description}
                        onInput={field.onChange}
                        onChange={() => field.value}
                      />
                      <p className="muted">Markdown support enabled.</p>
                      <FormMessage className="font-normal" />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="dueAt"
                  defaultValue={new Date(retrieveTask.dueAt)}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal">Deadline</FormLabel>
                      <Popover open={openDateSelector} onOpenChange={setOpenDateSelector}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            onClick={() => setOpenDateSelector(!openDateSelector)}
                          >
                            {field.value ? format(field.value, "dd.MM.yyyy") : <span>Pick a date</span>}
                            <IconCalendarDue stroke={1.5} size={16} className="ml-auto opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(value) => {
                              field.onChange(value);

                              setOpenDateSelector(!openDateSelector);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="font-normal" />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="listId"
                  defaultValue={retrieveTask.listId}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal">Status</FormLabel>
                      <Popover open={openListSelector} onOpenChange={setOpenListSelector}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openListSelector}
                            className="justify-between"
                          >
                            {lists.find((list) => list.id === field.value)?.name ?? "Unknown..."}
                            <IconSelector stroke={1.5} size={16} className="ml-2 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-md p-0">
                          <Command>
                            <CommandInput placeholder="Move to..." />
                            <CommandEmpty>No list found.</CommandEmpty>
                            <CommandGroup className="max-h-96 overflow-y-auto">
                              {lists.map((list) => (
                                <CommandItem
                                  key={list.id}
                                  value={list.name}
                                  onSelect={() => {
                                    field.onChange(list.id);

                                    setOpenListSelector(!openListSelector);
                                  }}
                                >
                                  <IconCheck
                                    stroke={1.5}
                                    size={16}
                                    className={cn("mr-2", field.value === list.id ? "opacity-100" : "opacity-0")}
                                  />
                                  {list.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="font-normal" />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="priority"
                  defaultValue={Priority[retrieveTask.priority]}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-normal">Priority</FormLabel>
                      <Popover open={openPrioritySelector} onOpenChange={setOpenPrioritySelector}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                            {field.value}
                            <IconSelector stroke={1.5} size={16} className="ml-2 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-md p-0">
                          <Command>
                            <CommandInput placeholder="Search priority..." />
                            <CommandEmpty>No priority found.</CommandEmpty>
                            <CommandGroup>
                              {priorities.map((priority) => (
                                <CommandItem
                                  key={priority}
                                  value={priority}
                                  onSelect={(currentValue) => {
                                    const selected = currentValue.toUpperCase() as Priority;

                                    field.onChange(selected);

                                    setOpenPrioritySelector(!openPrioritySelector);
                                  }}
                                >
                                  <IconCheck
                                    stroke={1.5}
                                    size={16}
                                    className={cn("mr-2", field.value === priority ? "opacity-100" : "opacity-0")}
                                  />
                                  {priority}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="font-normal" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
