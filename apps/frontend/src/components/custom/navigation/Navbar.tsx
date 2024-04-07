import { ModeToggle } from "@/components/ui/mode-toggle";
import { IconHistory, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import History from "../History";
import CreateList from "../list/CreateList";

const Navbar = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [openNewList, setOpenNewList] = useState(false);

  return (
    <div>
      <div className="flex w-full flex-col justify-between space-y-1 p-2.5 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex grow items-center justify-between sm:mr-4">
          <h1 className="h3 text-center font-bold md:text-left">My Task Board</h1>

          <ModeToggle />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button variant={"outline"} onClick={() => setShowHistory(!showHistory)}>
            <IconHistory stroke={1.5} className="mr-2" />
            History
          </Button>

          <Button onClick={() => setOpenNewList(!openNewList)}>
            <IconPlus stroke={1.5} className="mr-2" />
            Create new list
          </Button>
        </div>
      </div>

      <History open={showHistory} close={() => setShowHistory(!showHistory)} />
      <CreateList open={openNewList} close={() => setOpenNewList(!openNewList)} />
    </div>
  );
};

export default Navbar;
