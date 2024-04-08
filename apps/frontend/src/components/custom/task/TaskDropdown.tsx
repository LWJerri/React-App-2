import api from "@/app/api";
import { store } from "@/app/store";
import { useToast } from "@/components/ui/use-toast";
import { Task } from "@/types/Task";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { IconDotsVertical, IconEdit, IconHistory, IconInfoCircle, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "../../ui/dropdown-menu";
import EditTask from "./EditTask";
import TaskHistory from "./TaskHistory";
import TaskModalView from "./TaskModalView";

const TaskDropdown = (props: { task: Task }) => {
  const { task } = props;

  const { toast } = useToast();

  const [openEditTask, setOpenEditTask] = useState(false);
  const [openHistoryTask, setOpenHistoryTask] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const removeTask = store((state) => state.removeTask);

  async function deleteTask() {
    const { error, data } = await api.DELETE("/boards/{boardId}/lists/{listId}/tasks/{id}", {
      params: { path: { listId: task.listId, id: task.id, boardId: task.boardId } },
    });

    if (data) {
      toast({ title: "Task deleted", description: "Task successfully deleted." });

      removeTask(task.id);

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
          <Button size={"icon"} variant={"outline"}>
            <IconDotsVertical stroke={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowModal(!showModal)}>
              <IconInfoCircle stroke={1.5} size={16} className="mr-2" />
              <span>Detailed</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setOpenHistoryTask(!openHistoryTask)}>
              <IconHistory stroke={1.5} size={16} className="mr-2" />
              <span>History</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setOpenEditTask(!openEditTask)}>
              <IconEdit stroke={1.5} size={16} className="mr-2" />
              <span>Edit</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="text-[#ED4245]" onClick={() => deleteTask()}>
              <IconTrash stroke={1.5} size={16} className="mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTask open={openEditTask} close={() => setOpenEditTask(!openEditTask)} taskId={task.id} />

      <TaskHistory
        open={openHistoryTask}
        close={() => setOpenHistoryTask(!openHistoryTask)}
        boardId={task.boardId}
        listId={task.listId}
        taskId={task.id}
      />
      <TaskModalView task={task} open={showModal} close={() => setShowModal(!showModal)} />
    </div>
  );
};

export default TaskDropdown;
