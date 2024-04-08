import { Store } from "@/interfaces/Store";
import { Board } from "@/types/Board";
import { List } from "@/types/List";
import { Task } from "@/types/Task";
import { create } from "zustand";

export const store = create<Store>((set, get) => ({
  actualBoardId: "",
  getActualBoardId: () => get().actualBoardId,
  setActualBoardId: (boardId: string) => set(() => ({ actualBoardId: boardId })),

  boards: [],
  getBoards: () => get().boards,
  getBoard: (boardId: string) => get().boards.find((board) => board.id === boardId)!,
  addBoards: (newBoards: Board[]) =>
    set(({ boards }) => ({
      boards: [...newBoards]
        .filter((newBoard) => !boards.map((board) => board.id).includes(newBoard.id))
        .concat(boards),
    })),
  updateBoard: (updatedBoard: Omit<Board, "list">) => {
    set(({ boards }) => ({
      boards: boards.map((board) => (board.id === updatedBoard.id ? { ...updatedBoard, list: board.list } : board)),
    }));
  },
  removeBoard: (boardId: string) => set(({ boards }) => ({ boards: boards.filter((board) => board.id !== boardId) })),

  lists: [],
  getLists: () => get().lists.filter((list) => list.boardId === get().actualBoardId),
  getList: (listId: string) => get().lists.find((list) => list.id === listId)!,
  addLists: (newLists: List[]) =>
    set(({ lists }) => ({
      lists: [...newLists].filter((newList) => !lists.map((list) => list.id).includes(newList.id)).concat(lists),
    })),
  updateList: (updatedList: Omit<List, "task">) => {
    set(({ lists }) => ({
      lists: lists.map((list) => (list.id === updatedList.id ? { ...updatedList, task: list.task } : list)),
    }));
  },
  removeList: (listId: string) => set(({ lists }) => ({ lists: lists.filter((list) => list.id !== listId) })),

  tasks: [],
  getTasks: (listId: string) =>
    get().tasks.filter((task) => task.listId === listId && task.boardId === get().actualBoardId),
  getTask: (taskId: string) => get().tasks.find((task) => task.id === taskId)!,
  addTasks: (newTasks: Task[]) => {
    set(({ tasks }) => ({
      tasks: [...newTasks].filter((newTask) => !tasks.map((task) => task.id).includes(newTask.id)).concat(tasks),
    }));
    set(({ lists }) => ({
      lists: lists.map((list) => ({ ...list, task: get().getTasks(list.id).length })),
    }));
  },
  updateTask: (updatedTask: Task) => {
    set(({ tasks }) => ({
      tasks: tasks
        .map((task) => (task.id === updatedTask.id ? updatedTask : task))
        .sort((start, end) => {
          const timeA = new Date(start.createdAt).getTime();
          const timeB = new Date(end.createdAt).getTime();

          return timeB - timeA;
        }),
    }));
    set(({ lists }) => ({
      lists: lists.map((list) => ({ ...list, task: get().getTasks(list.id).length })),
    }));
  },
  removeTask: (taskId) => {
    set(({ tasks }) => ({ tasks: tasks.filter((task) => task.id !== taskId) }));
    set(({ lists }) => ({
      lists: lists.map((list) => ({ ...list, task: get().getTasks(list.id).length })),
    }));
  },
}));
