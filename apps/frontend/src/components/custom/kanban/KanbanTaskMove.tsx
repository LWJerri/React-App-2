import api from "@/app/api";
import { store } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { IconCheck, IconSelector } from "@tabler/icons-react";
import { useState } from "react";

const KanbanTaskMove = (props: { taskId: string }) => {
  const { taskId } = props;

  const { toast } = useToast();

  const [openListSelector, setOpenListSelector] = useState(false);

  const retrieveTask = store((state) => state.getTask(taskId));
  const lists = store((state) => state.getLists()).filter((list) => list.id !== retrieveTask.listId);

  const updateTask = store((state) => state.updateTask);

  async function moveTask(newListId: string) {
    const { data, error } = await api.PATCH("/boards/{boardId}/lists/{listId}/tasks/{id}", {
      params: { path: { id: retrieveTask.id, listId: retrieveTask.listId, boardId: retrieveTask.boardId } },
      body: { listId: newListId },
    });

    if (data) {
      updateTask(data);

      toast({
        title: "Task list changed",
        description: (
          <p>
            Task <b>{data.name}</b> successfully moved to another list
          </p>
        ),
      });

      return;
    }

    if (!error) {
      toast({ title: "Something went wrong", description: "Please try again later 😭", variant: "destructive" });

      return;
    }

    toast({
      title: error.error ?? "Something went wrong",
      description: typeof error.message === "string" ? error.message : error.message.join(", "),
      variant: "destructive",
    });

    setOpenListSelector(!openListSelector);
  }

  return (
    <Popover open={openListSelector} onOpenChange={setOpenListSelector}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={openListSelector} className="justify-between">
          Move to...
          <IconSelector stroke={1.5} size={16} className="ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-md p-0">
        <Command>
          <CommandInput placeholder="Move to..." />
          <CommandEmpty>No list found.</CommandEmpty>
          <CommandGroup className="max-h-96 overflow-y-auto">
            {lists.map((list) => (
              <CommandItem key={list.id} value={list.name} onSelect={() => moveTask(list.id)}>
                <IconCheck
                  stroke={1.5}
                  size={16}
                  className={cn("mr-2", retrieveTask.listId === list.id ? "opacity-100" : "opacity-0")}
                />
                {list.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default KanbanTaskMove;
