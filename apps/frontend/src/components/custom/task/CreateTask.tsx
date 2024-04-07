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

const CreateTaskSchema = z.object({
  name: z.string().trim().min(3).max(20),
  description: z.string().trim().min(1).max(3000),
  dueAt: z.date(),
  priority: z.nativeEnum(Priority),
});

const CreateTask = (props: { open: boolean; close: () => void; listId: string }) => {
  const { open, close, listId } = props;

  const { toast } = useToast();

  const [openDateSelector, setOpenDateSelector] = useState(false);
  const [openPrioritySelector, setOpenPrioritySelector] = useState(false);

  const form = useForm<z.infer<typeof CreateTaskSchema>>({ resolver: zodResolver(CreateTaskSchema), mode: "onChange" });

  useEffect(() => form.reset(), [open]);

  const addTasks = store((state) => state.addTasks);

  const priorities = Object.keys(Priority);

  async function onSubmit(data: z.infer<typeof CreateTaskSchema>) {
    const { dueAt, ...fields } = data;

    const request = await api.POST("/lists/{listId}/tasks", {
      body: { dueAt: new Date(dueAt).toISOString(), ...fields },
      params: { path: { listId } },
    });

    if (request.data) {
      const { data } = request;

      toast({
        title: "Task created",
        description: (
          <p>
            Task <b>{data.name}</b> successfully created.
          </p>
        ),
      });

      addTasks([data]);

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
          <DialogTitle>Create new task</DialogTitle>
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
                        placeholder="Task name"
                        onInput={field.onChange}
                        onChange={() => field.value}
                        autoFocus
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
                      <Textarea placeholder="Task description" onInput={field.onChange} onChange={() => field.value} />
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
                  name="priority"
                  defaultValue={Priority.LOW}
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
                <Button type="submit">Create</Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
