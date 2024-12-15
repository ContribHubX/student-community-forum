import { FlexContainer } from "@/components/ui/flex-container";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { statusColors } from "../constant";
import { users } from "@/features/shared/data/users";
import { Task as TaskType } from "@/types";
import { TaskForm } from "./task-form";

import { FaEllipsisH, FaTrashAlt } from "react-icons/fa";
// import { LuMessagesSquare } from "react-icons/lu";
import { GrAttachment, GrEdit } from "react-icons/gr";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { useDeleteTask } from "../api/delete-task";

export interface TaskProp {
  task: TaskType;
}

export const Task = ({ task }: TaskProp) => {
  const { isDark } = useTheme();
  const [isEditing, setEditing] = useState(false);
  const { mutate: deleteTask } = useDeleteTask({});
  const { text, background } =
    statusColors[
      task.status === "todo"
        ? "archived"
        : task.status === "doing"
          ? "finished"
          : "active"
    ];

  return (
    <FlexContainer
      direction="col"
      className={`bg-primary rounded-md items-start text-primary-foreground max-w-[300px] shadow-md relative ${!isEditing && "p-3"}`}
    >
      {" "}
      {!isEditing ? (
        <>
          <FlexContainer className="justify-between">
            <small
              className="rounded-lg py-[5px] px-2 text-xs"
              style={{
                color: text,
                backgroundColor: !isDark ? background : "#1e252b",
              }}
            >
              {task.status}
            </small>
            <Popover>
              <PopoverTrigger>
                <FaEllipsisH className="" />
              </PopoverTrigger>
              <PopoverContent className="w-[100px] p-0 bg-background rounded-md">
                <div className="p-2">
                  <span
                    className="cursor-pointer rounded-md p-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setEditing(true)}
                  >
                    <GrEdit className="text-sm" />
                    <p className="text-[.8rem]">Edit</p>
                  </span>
                  <span
                    className="rounded-md cursor-pointer p-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => deleteTask(task.id)}
                  >
                    <FaTrashAlt className="text-sm" />
                    <p className="text-[.8rem]">Delete</p>
                  </span>
                </div>
              </PopoverContent>
            </Popover>
          </FlexContainer>

          {/* attachment here */}
          {task.attachment && (
            <img
              src={task.attachment}
              alt="attachment"
              className="max-h-[160px] w-full object-cover"
            />
          )}

          <FlexContainer direction="col" className="items-start">
            {/* <img 
                  src="" 
                  alt="image" 
              /> */}
            <h2 className="font-semibold">{task.name}</h2>
            <p className="text-[.8rem] text-muted-foreground font-light">
              {task.description}
            </p>
          </FlexContainer>

          <FlexContainer className="justify-between items-center h-fit">
            <FlexContainer className="items-center gap-1">
              {users.slice(0, 3).map((user) => (
                <Avatar
                  key={user.id}
                  className="w-[30px] h-[30px] rounded-full"
                >
                  <AvatarImage src={user.attachment} className="object-cover" />
                </Avatar>
              ))}

              {task.assignees?.map((user) => (
                <Avatar
                  key={user.id}
                  className="w-[30px] h-[30px] rounded-full"
                >
                  <AvatarImage src={user.attachment} className="object-cover" />
                </Avatar>
              ))}
            </FlexContainer>

            <FlexContainer className="text-muted-foreground items-start w-fit mb-2">
              {/* <FlexContainer>
                <LuMessagesSquare className="text-lg" />
                <span className="text-xs ml-[-6px]">{12}</span>
              </FlexContainer> */}

              <FlexContainer>
                <GrAttachment className="text-sm" />
                <span className="text-xs ml-[-6px]">
                  {task.attachment ? 1 : 0}
                </span>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        </>
      ) : (
        <TaskForm
          initialTask={task}
          boardId={task.boardId}
          type={task.status}
          onCancel={() => setEditing(false)}
        />
      )}
    </FlexContainer>
  );
};
