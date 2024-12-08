import { Draggable } from "@hello-pangea/dnd";

import { Task } from "./task";
import { statusColors } from "../constant";
import { TaskForm } from "./task-form";

import { FaTasks } from "react-icons/fa";
import { LuPlusCircle } from "react-icons/lu";

import { TaskStatusType, Task as TaskType } from "@/types";
import { useTheme } from "@/hooks/use-theme";
import { useDisclosure } from "@/hooks/use-disclosure";

interface TaskColumnProp {
  currentUserId: string;
  boardId: string;
  type: TaskStatusType;
  tasks: TaskType[];
}

export const TaskColumn = ({
  currentUserId,
  boardId,
  type,
  tasks,
}: TaskColumnProp) => {
  const separatorColor =
    type === "todo"
      ? statusColors["archived"].text
      : type === "doing"
        ? statusColors["finished"].text
        : statusColors["active"].text;
  const { isDark } = useTheme();
  const { isOpen, toggle } = useDisclosure();

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

      <div className={`${!isOpen && "hidden"}  mt-6`}>
        <TaskForm 
          currentUserId={currentUserId} 
          boardId={boardId} 
          type={type} 
          onCancel={toggle}
        />
      </div>

      <div
        className=" rounded-md flex items-center justify-center gap-3 p-2 mt-6 relative cursor-pointer"
        style={{
          color: statusColors["finished"].text,
          background: !isDark ? statusColors["finished"].background : "#262d34",
        }}
        onClick={toggle}
      >
        <p className="text-center text-sm">Add a card</p>
        <LuPlusCircle className="text-lg" />
      </div>
    </div>
  );
};
