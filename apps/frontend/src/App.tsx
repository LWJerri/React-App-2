import { IconGhost3 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import api from "./app/api";
import { store } from "./app/store";
import KanbanHeader from "./components/custom/kanban/KanbanHeader";
import KanbanTask from "./components/custom/kanban/KanbanTask";
import KanbanTaskButton from "./components/custom/kanban/KanbanTaskButton";
import Navbar from "./components/custom/navigation/Navbar";
import { ThemeProvider } from "./components/ui/theme-provider";
import { useToast } from "./components/ui/use-toast";

const App = () => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);

  const boardId = store((state) => state.getActualBoardId());
  const lists = store((state) => state.getLists());

  const addListsToStore = store((state) => state.addLists);

  useEffect(() => {
    if (!boardId) return;

    setLoading(true);

    api.GET("/boards/{boardId}/lists", { params: { path: { boardId } } }).then(({ data, error }) => {
      setLoading(false);

      if (data) return addListsToStore(data);

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
  }, [boardId]);

  return (
    <ThemeProvider>
      <Navbar />

      {!loading && lists.length > 0 && (
        <div className="flip-scrollbar grid max-w-full auto-cols-max grid-flow-col gap-4 overflow-x-auto p-2.5">
          {lists.map((list) => (
            <div className="flip-scrollbar w-[350px]" key={list.id}>
              <div className="grid gap-4">
                <KanbanHeader list={list} />

                <KanbanTaskButton listId={list.id} />

                <KanbanTask boardId={list.boardId} listId={list.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !lists.length && (
        <div className="flex h-screen">
          <div className="m-auto flex flex-col items-center">
            <h1 className="h1 flex items-center">
              <IconGhost3 size={128} />
            </h1>

            <h3 className="h3">No lists found</h3>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
};

export default App;
