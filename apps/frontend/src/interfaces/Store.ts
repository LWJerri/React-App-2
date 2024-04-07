import { Board } from "@/types/Board";
import { List } from "@/types/List";
import { Task } from "@/types/Task";

export interface Store {
  actualBoardId: string;
  getActualBoardId: () => string;
  setActualBoardId: (boardId: string) => void;

  boards: Board[];
  getBoards: () => Board[];
  getBoard: (boardId: string) => Board;
  addBoards: (boards: Board[]) => void;
  updateBoard: (board: Board) => void;
  removeBoard: (boardId: string) => void;

  lists: List[];
  getLists: () => List[];
  getList: (listId: string) => List;
  addLists: (lists: List[]) => void;
  updateList: (list: Omit<List, "task">) => void;
  removeList: (listId: string) => void;

  tasks: Task[];
  getTasks: (listId: string) => Task[];
  getTask: (taskId: string) => Task;
  addTasks: (tasks: Task[]) => void;
  updateTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
}
