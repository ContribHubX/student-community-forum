import { useEffect, useState } from "react";

import { Task, TaskStatusType } from "@/types";
import { UpdateTaskType } from "@/features/workspace/api/update-task";

export const useKanbanDrag = (
  tasksData: Task[] | undefined,
  updateTask: (task: UpdateTaskType) => void,
  boardId: string | undefined,
) => {
  const [tasks, setTasks] = useState<Task[]>();

  useEffect(() => {
    if (tasksData) setTasks(tasksData);
  }, [tasksData]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceStatus = source.droppableId as TaskStatusType;
    const destinationStatus = destination.droppableId as TaskStatusType;

    if (!tasks) return;

    const sourceTasks = tasks.filter((task) => task.status === sourceStatus);
    const destinationTasks = tasks.filter(
      (task) => task.status === destinationStatus,
    );

    const movedTask = sourceTasks[source.index];
    if (!movedTask || !boardId) return;

    sourceTasks.splice(source.index, 1);

    // Update the task's status
    movedTask.status = destinationStatus;

    // Remove task from the destination column
    const destinationTask = destinationTasks[destination.index];

    // Update sequence of the moved task based on its position in the destination column
    movedTask.sequence = destinationTask
      ? destinationTask.sequence
      : destinationTasks.length + 1;

    // Kayasa nigana ang amaw
    const taskToBeUpdate: Partial<UpdateTaskType> & { id?: string } = {
      ...movedTask,
      boardId: boardId,
      taskId: movedTask.id,
      createdBy: movedTask.createdBy.id,
    };
    delete taskToBeUpdate.id;
    updateTask({ ...taskToBeUpdate, isDragUpdate: true } as UpdateTaskType);

    // Insert the task into its new position
    destinationTasks.splice(destination.index, 0, movedTask);

    sourceTasks.sort((a, b) => a.sequence - b.sequence);
    destinationTasks.sort((a, b) => a.sequence - b.sequence);

    // const updatedTasks = [
    //   ...tasks.filter(
    //     (task) =>
    //       task.status !== sourceStatus && task.status !== destinationStatus,
    //   ),
    //   ...sourceTasks,
    //   ...destinationTasks,
    // ];

    // setTasks(updatedTasks);
  };

  return { onDragEnd };
};
