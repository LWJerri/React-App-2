import api from "@/app/api";
import { store } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import CreateBoard from "./CreateBoard";
import EditBoard from "./EditBoard";

const BoardList = (props: { open: boolean; close: () => void }) => {
  const { open, close } = props;

  const { toast } = useToast();

  const [openEditBoard, setOpenEditBoard] = useState(false);
  const [openNewBoard, setOpenNewBoard] = useState(false);

  const boards = store((state) => state.getBoards());

  const addBoardsToStore = store((state) => state.addBoards);

  useEffect(() => {
    if (!open) return;

    api.GET("/boards").then(({ data, error }) => {
      if (data) return addBoardsToStore(data);

      if (!error) {
        toast({ title: "Something went wrong", description: "Please try again later 😭", variant: "destructive" });

        return;
      }

      toast({
        title: error.error ?? "Something went wrong",
        description: typeof error.message === "string" ? error.message : error.message.join(", "),
        variant: "destructive",
      });
    });
  }, [open]);

  const setActualBoardId = store((state) => state.setActualBoardId);
  const actualBoardId = store((state) => state.getActualBoardId());

  const removeBoard = store((state) => state.removeBoard);

  async function deleteBoard(boardId: string) {
    const { error, data } = await api.DELETE("/boards/{id}", { params: { path: { id: boardId } } });

    if (data) {
      toast({ title: "Board deleted", description: "Board successfully deleted." });

      if (boardId === actualBoardId) {
        setActualBoardId("");
      }

      removeBoard(boardId);

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
      <Sheet open={open} onOpenChange={close}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Boards List</SheetTitle>
          </SheetHeader>

          <div className="grid w-full gap-2 overflow-y-auto">
            {boards.length > 0 &&
              boards.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setActualBoardId(item.id);
                      close();
                    }}
                    className="grow"
                  >
                    {item.name}
                  </Button>

                  <Button size={"icon"} variant={"outline"} onClick={() => setOpenEditBoard(!openEditBoard)}>
                    <IconPencil stroke={1.5} />
                  </Button>

                  <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => deleteBoard(item.id)}
                    className="hover:bg-red-300 hover:text-black"
                  >
                    <IconTrash stroke={1.5} />
                  </Button>
                </div>
              ))}

            <div>
              <div
                className="hover:bg-muted cursor-pointer rounded-md border border-dashed p-0.5 py-2 transition-all duration-150 hover:border-black"
                onClick={() => setOpenNewBoard(!openNewBoard)}
              >
                <div className="flex items-center justify-center">
                  <IconPlus stroke={1.5} className="mr-2" />
                  <p className="large">Add new board</p>
                </div>
              </div>

              <CreateBoard open={openNewBoard} close={() => setOpenNewBoard(!openNewBoard)} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <EditBoard open={openEditBoard} close={() => setOpenEditBoard(false)} boardId={actualBoardId} />
    </div>
  );
};

export default BoardList;
