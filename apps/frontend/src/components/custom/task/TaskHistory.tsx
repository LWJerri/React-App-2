import api from "@/app/api";
import { store } from "@/app/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { History } from "@/types/History";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";

const TaskHistory = (props: { open: boolean; close: () => void; boardId: string; listId: string; taskId: string }) => {
  const { open, close, boardId, listId, taskId } = props;

  const { toast } = useToast();

  const [history, setHistory] = useState<Omit<History, "relatedId">[]>([]);

  const getList = store((state) => state.getList);

  useEffect(() => {
    if (!open) return;

    api
      .GET("/boards/{boardId}/lists/{listId}/tasks/{id}/audit", { params: { path: { id: taskId, listId, boardId } } })
      .then(({ data, error }) => {
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
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task History</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 overflow-y-auto">
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
                      You delete {item.relatedModel.toLowerCase()} <b>{item.oldState.name}</b>
                    </p>
                  )}

                  {item.action === "EDIT" && item.affectedField !== "dueAt" && item.affectedField !== "listId" && (
                    <p>
                      You edit {item.relatedModel.toLowerCase()} {item.affectedField} from {/* @ts-ignore */}
                      <b>{item.oldState[item.affectedField]}</b> to <b>{item.newState[item.affectedField]}</b>
                    </p>
                  )}

                  {item.action === "EDIT" && item.affectedField === "dueAt" && (
                    <p>
                      You edit {item.relatedModel.toLowerCase()} {item.affectedField} from {/* @ts-ignore */}
                      <b>{format(item.oldState[item.affectedField], "dd.MM.yyyy")}</b> to {/* @ts-ignore */}
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

          {!history.length &&
            [...Array(3)].map((_, i) => (
              <div className="rounded-lg border p-4" key={i}>
                <div className="[&amp;_p]:leading-relaxed">
                  <Skeleton />
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskHistory;
