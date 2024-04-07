import { List } from "@/types/List";
import { Task } from "@/types/Task";

export interface Store {
  lists: List[];
  getLists: () => List[];
  getList: (listId: string) => List;
  addLists: (lists: List[]) => void;
  updateList: (list: List) => void;
  removeList: (listId: string) => void;

  tasks: Task[];
  getTasks: (listId: string) => Task[];
  getTask: (taskId: string) => Task;
  addTasks: (tasks: Task[]) => void;
  updateTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
}
