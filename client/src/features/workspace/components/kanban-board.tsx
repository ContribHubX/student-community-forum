import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { TaskColumn } from "./task-column";
import { TaskStatusType } from "@/types";
import { useGetTasks } from "../api/get-all-tasks";
import { useParams } from "react-router-dom";
import { useUpdateTask } from "../api/update-task";
import { useKanbanDrag } from "@/features/workspace/hooks/use-kanban-drag";

// TODO napay bug ang giatay kung mo drag sa same column mo duplicate

export const KanbanBoard = () => {
  const { boardId } = useParams();
  const { data: taskData } = useGetTasks({ boardId: boardId || "" });
  const { mutate: updateTask } = useUpdateTask({});
  const { onDragEnd } = useKanbanDrag(taskData, updateTask, boardId);

  if (!taskData) return <p>Loading...</p>;

  console.log(taskData)

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 max-w-[1000px] gap-4 mx-auto">
        {["todo", "doing", "finished"].map((type) => (
          <Droppable key={type} droppableId={type}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-h-[500px] flex flex-col gap-4"
              >
                <TaskColumn
                  type={type as TaskStatusType}
                  tasks={taskData
                    .filter((task) => task.status === type)
                    .sort((a, b) => a.sequence - b.sequence)}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
