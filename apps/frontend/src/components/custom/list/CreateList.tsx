import api from "@/app/api";
import { store } from "@/app/store";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";

const CreateListSchema = z.object({
  name: z.string().trim().min(3).max(20),
});

const CreateList = (props: { open: boolean; close: () => void }) => {
  const { open, close } = props;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof CreateListSchema>>({ resolver: zodResolver(CreateListSchema), mode: "onChange" });

  const addLists = store((state) => state.addLists);

  async function onSubmit(data: z.infer<typeof CreateListSchema>) {
    const request = await api.POST("/lists", { body: data });

    if (request.data) {
      const { data } = request;

      toast({
        title: "List created",
        description: (
          <p>
            List <b>{data.name}</b> successfully created.
          </p>
        ),
      });

      addLists([{ ...data, task: 0 }]);

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
          <DialogTitle>Create new list</DialogTitle>
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
                      placeholder="List name"
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
                <Button type="submit">Create</Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateList;
