import { store } from "@/app/store";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import { IconHistory, IconLayoutKanban, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import History from "../History";
import BoardList from "../board/BoardList";
import CreateList from "../list/CreateList";

const Navbar = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [openNewList, setOpenNewList] = useState(false);
  const [openBoardList, setOpenBoardList] = useState(false);

  const boardId = store((state) => state.getActualBoardId());
  const board = store((state) => state.getBoard(state.getActualBoardId()));

  return (
    <div>
      <div className="flex w-full flex-col justify-between space-y-1 p-2.5 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex grow items-center justify-between sm:mr-1">
          <h1 className="h3 text-center font-bold md:text-left">Task Manager V2</h1>

          <ModeToggle />
        </div>

        <div className="flex flex-col gap-1 sm:flex-row">
          <Button onClick={() => setOpenBoardList(!openBoardList)} variant={"outline"}>
            <IconLayoutKanban stroke={1.5} className="mr-2" />
            {board?.name ?? "Choose a board"}
          </Button>

          <Button variant={"outline"} onClick={() => setShowHistory(!showHistory)} className={cn({ hidden: !boardId })}>
            <IconHistory stroke={1.5} className="mr-2" />
            History
          </Button>

          <Button onClick={() => setOpenNewList(!openNewList)} className={cn({ hidden: !boardId })}>
            <IconPlus stroke={1.5} className="mr-2" />
            Create new list
          </Button>
        </div>
      </div>

      <History open={showHistory} close={() => setShowHistory(!showHistory)} boardId={boardId} />
      <CreateList open={openNewList} close={() => setOpenNewList(!openNewList)} boardId={boardId} />
      <BoardList open={openBoardList} close={() => setOpenBoardList(!openBoardList)} />
    </div>
  );
};

export default Navbar;
