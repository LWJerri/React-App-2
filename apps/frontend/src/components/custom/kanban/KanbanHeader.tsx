import { List } from "@/types/List";
import KanbanDropdown from "./KanbanDropdown";

const KanbanHeader = (props: { list: List }) => {
  const { list } = props;

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-t-2 p-0.5">
        <h4 className="h4">{list.name}</h4>

        <div className="flex items-center space-x-4">
          <p className="p font-bold">{list.task}</p>

          <KanbanDropdown list={list} />
        </div>
      </div>
    </div>
  );
};

export default KanbanHeader;
