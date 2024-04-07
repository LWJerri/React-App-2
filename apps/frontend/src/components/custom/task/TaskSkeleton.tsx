import { Skeleton } from "@/components/ui/skeleton";

const TaskSkeleton = () => {
  return (
    <div className="rounded-lg border shadow-sm hover:border-dashed">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex w-full items-center justify-between">
          <h3 className="leading-none tracking-tight">
            <Skeleton className="w-[155px] py-1.5" />
          </h3>

          <div>
            <div className="border-input h-10 w-10 animate-pulse items-center justify-center rounded-md border transition-colors"></div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <Skeleton className="w-full" />
      </div>
      <div className="flex items-center p-6 pt-0">
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <label className="leading-none">
                <Skeleton className="w-[120px]" />
              </label>
            </div>

            <div className="inline-flex items-center border border-transparent px-2.5 py-0.5 transition-colors">
              <Skeleton className="w-[56px]" />
            </div>
          </div>

          <div className="border-input inline-flex h-10 items-center justify-between rounded-md border px-4 py-2 transition-colors">
            <Skeleton className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSkeleton;
