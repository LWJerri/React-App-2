import api from "@/app/api";
import { store } from "@/app/store";
import { useToast } from "@/components/ui/use-toast";
import { List } from "@/types/List";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { IconDotsVertical, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "../../ui/dropdown-menu";
import EditList from "../list/EditList";
import CreateTask from "../task/CreateTask";

const KanbanDropdown = (props: { list: List }) => {
  const { list } = props;

  const { toast } = useToast();

  const [openEditList, setOpenEditList] = useState(false);
  const [openNewTask, setOpenNewTask] = useState(false);

  const removeList = store((state) => state.removeList);

  async function deleteList() {
    const { error, data } = await api.DELETE("/boards/{boardId}/lists/{id}", {
      params: { path: { id: list.id, boardId: list.boardId } },
    });

    if (data) {
      toast({ title: "List deleted", description: "List successfully deleted." });

      removeList(list.id);

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
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            <IconDotsVertical stroke={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setOpenNewTask(!openNewTask)}>
              <IconPlus stroke={1.5} size={16} className="mr-2" />
              <span>Add new task</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setOpenEditList(!openEditList)}>
              <IconEdit stroke={1.5} size={16} className="mr-2" />
              <span>Edit</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="text-[#ED4245]" onClick={() => deleteList()}>
              <IconTrash stroke={1.5} size={16} className="mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditList open={openEditList} close={() => setOpenEditList(!openEditList)} listId={list.id} />
      <CreateTask open={openNewTask} close={() => setOpenNewTask(!openNewTask)} listId={list.id} />
    </div>
  );
};

export default KanbanDropdown;
