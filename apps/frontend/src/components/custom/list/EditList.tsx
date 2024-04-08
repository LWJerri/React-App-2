import api from "@/app/api";
import { store } from "@/app/store";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";

const EditListSchema = z.object({
  name: z.string().trim().min(3).max(20),
});

const EditList = (props: { open: boolean; close: () => void; listId: string }) => {
  const { open, close, listId } = props;

  const { toast } = useToast();

  const getList = store((state) => state.getList(listId));
  const updateList = store((state) => state.updateList);

  const form = useForm<z.infer<typeof EditListSchema>>({ resolver: zodResolver(EditListSchema), mode: "onChange" });

  async function onSubmit(data: z.infer<typeof EditListSchema>) {
    const request = await api.PATCH("/boards/{boardId}/lists/{id}", {
      body: data,
      params: { path: { id: getList.id, boardId: getList.boardId } },
    });

    if (request.data) {
      const { data } = request;

      toast({
        title: "List updated",
        description: (
          <p>
            List name updated to <b>{data.name}</b>.
          </p>
        ),
      });

      updateList(data);

      close();
    } else {
      if (!request.error) {
        toast({ title: "Something went wrong", description: "Please try again later 😭", variant: "destructive" });

        return;
      }

      const { error } = request;

      toast({
        title: error.error ?? "Something went wrong",
        description: typeof error.message === "string" ? error.message : error.message.join(", "),
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit list</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col justify-between space-y-4">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-normal">Name</FormLabel>
                    <Input
                      type="text"
                      defaultValue={getList.name}
                      onInput={field.onChange}
                      onChange={() => field.value}
                      autoFocus
                    />
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditList;
