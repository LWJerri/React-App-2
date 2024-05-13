import api from "@/app/api";
import { store } from "@/app/store";
import { History as HistoryType } from "@/types/History";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "../ui/use-toast";

const History = (props: { open: boolean; close: () => void; boardId: string }) => {
  const { open, close, boardId } = props;

  const { toast } = useToast();

  const [history, setHistory] = useState<HistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  const getList = store((state) => state.getList);

  useEffect(() => {
    if (!open) return;

    api.GET("/boards/{id}/audit", { params: { path: { id: boardId } } }).then(({ data, error }) => {
      setLoading(false);

      if (data) return setHistory(data);

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

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>History</SheetTitle>
        </SheetHeader>

        <div className="grid w-full gap-2 overflow-y-auto">
          {history.length > 0 &&
            history.map((item, i) => (
              <Alert key={i}>
                <AlertDescription className="flex flex-col justify-between space-y-2 break-all sm:flex-row sm:space-x-2 sm:space-y-0">
                  {item.action === "CREATE" && (
                    <p>
                      You create a new {item.relatedModel.toLowerCase()} <b>{item.newState.name}</b>
                    </p>
                  )}

                  {item.action === "DELETE" && (
                    <p>
                      You delete {item.relatedModel.toLowerCase()} <b>{item.newState.name}</b>
                    </p>
                  )}

                  {item.action === "EDIT" && item.affectedField !== "dueAt" && item.affectedField !== "listId" && (
                    <p>
                      You edit {item.relatedModel.toLowerCase()} {item.affectedField} from
                      {/* @ts-ignore */}
                      <b>{item.newState[item.affectedField]}</b> to
                      {/* @ts-ignore */}
                      <b>{item.newState[item.affectedField]}</b>
                    </p>
                  )}

                  {item.action === "EDIT" && item.affectedField === "dueAt" && (
                    <p>
                      You edit {item.relatedModel.toLowerCase()} {item.affectedField} from
                      {/* @ts-ignore */}
                      <b>{format(item.newState[item.affectedField], "dd.MM.yyyy")}</b> to
                      {/* @ts-ignore */}
                      <b>{format(item.newState[item.affectedField], "dd.MM.yyyy")}</b>
                    </p>
                  )}

                  {item.action === "EDIT" && item.affectedField === "listId" && (
                    <p>
                      You moved task <b>{item.newState.name}</b> <span>from </span>
                      {/* @ts-ignore */}
                      {getList(item.oldState[item.affectedField])?.name ?? item.oldState[item.affectedField]}
                      <span> to </span>
                      {/* @ts-ignore */}
                      {getList(item.newState[item.affectedField])?.name ?? item.newState[item.affectedField]}
                    </p>
                  )}
                  <p className="flex-none text-right sm:text-left">{format(item.createdAt, "dd.MM.yyyy")}</p>
                </AlertDescription>
              </Alert>
            ))}

          {loading &&
            [...Array(6)].map((_, i) => (
              <div className="rounded-lg border p-4" key={i}>
                <div className="[&amp;_p]:leading-relaxed">
                  <Skeleton />
                </div>
              </div>
            ))}

          {!loading && !history.length && <p>No history... Try to do something...</p>}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default History;
