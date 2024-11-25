import { Draggable } from "@hello-pangea/dnd";

import { Task } from "./task";

import { statusColors } from "../constant";
import { FaTasks } from "react-icons/fa";

import { TaskStatusType, Task as TaskType } from "@/types";

interface TaskColumnProp {
  type: TaskStatusType;
  tasks: TaskType[];
}

export const TaskColumn = ({ type, tasks }: TaskColumnProp) => {
  const separatorColor =
    type === "todo"
      ? statusColors["archived"].text
      : type === "doing"
        ? statusColors["finished"].text
        : statusColors["active"].text;

  return (
    <div className="max-w-[300px]">
      <div className="flex items-center justify-between mb-2 text-primary-foreground">
        <h1>{type.charAt(0).toUpperCase() + type.substring(1)}</h1>
        <FaTasks className="text-lg " />
      </div>
      <div
        className="h-[4px] rounded-full mb-2"
        style={{ background: separatorColor }}
      />
      <div className="flex flex-col gap-6">
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <Task task={task} />
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
};
