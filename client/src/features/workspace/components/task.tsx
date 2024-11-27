import { FlexContainer } from "@/components/ui/flex-container";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { statusColors } from "../constant";
import { users } from "@/features/shared/data/users";
import { Task as TaskType } from "@/types";

import { FaEllipsisH } from "react-icons/fa";
import { LuMessagesSquare } from "react-icons/lu";
import { GrAttachment } from "react-icons/gr";
import { useTheme } from "@/hooks/use-theme";

export interface TaskProp {
  task: TaskType;
}

export const Task = ({ task }: TaskProp) => {
  const { isDark } = useTheme();
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
      className="bg-primary rounded-md items-start text-primary-foreground p-3  pb-1 max-w-[300px] shadow-md relative"
    >
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
        <FaEllipsisH />
      </FlexContainer>

      {/* attachment here */}
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
        <FlexContainer className="items-center gap-0">
          {users.slice(0, 3).map((user) => (
            <Avatar key={user.id}>
              <AvatarImage
                src={user.attachment}
                className="object-cover w-[30px] h-[30px] rounded-full"
              />
            </Avatar>
          ))}
        </FlexContainer>

        <FlexContainer className="text-muted-foreground items-start w-fit mb-2">
          <FlexContainer>
            <LuMessagesSquare className="text-lg" />
            <span className="text-xs ml-[-6px]">{12}</span>
          </FlexContainer>

          <FlexContainer>
            <GrAttachment className="text-sm" />
            <span className="text-xs ml-[-6px]">{1}</span>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
