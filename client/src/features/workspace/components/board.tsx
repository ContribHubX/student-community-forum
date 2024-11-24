import { FaEllipsisH } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { FlexContainer } from "@/components/ui/flex-container";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { users } from "@/features/shared/data/users";
import { statusColors } from "../constant";

import { useTheme } from "@/hooks/use-theme";
import { Board as BoardType } from "@/types";


interface BoardProp {
  board: BoardType;
}

export const Board = ({ board }: BoardProp) => {
  const { text, background } = statusColors[board.status];
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className="h-[200px] rounded-md bg-primary p-3 text-primary-foreground  transition-shadow duration-300 shadow-md"
      onClick={() => navigate(`/workspace/${board.id}`)}
      // onMouseEnter={(e) => {
      //     e.currentTarget.style.boxShadow = `0px 0px 10px 1px ${text}`;
      // }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.classList.add("shadow-md");
      }}
    >
      <FlexContainer className="justify-between">
        <small
          className="rounded-lg py-[5px] px-2 text-xs"
          style={{
            color: text,
            backgroundColor: !isDark ? background : "#1e252b",
          }}
        >
          {board.status}
        </small>
        <FaEllipsisH className="text-muted-foreground" />
      </FlexContainer>

      <div className="ml-1">
        <FlexContainer className="gap-4 mt-5">
          <div
            className="rounded-full w-[10px] h-[10px]"
            style={{
              backgroundColor:
                Object.values(statusColors)[Math.floor(Math.random() * 3)].text,
            }}
          />
          <p className="font-semibold">{board.name}</p>
        </FlexContainer>
        <small className="text-muted-foreground text-xs">
          May 25, 2022 - Present
        </small>
      </div>

      <div className="mt-4">
        <Progress value={50} className="h-[7px]" indicatorColor={text} />
      </div>

      <FlexContainer className="gap-1 mt-4">
        {users.slice(0, 3).map((user) => (
          <Avatar key={user.id}>
            <AvatarImage
              src={user.attachment}
              className="object-cover w-[35px] h-[35px] rounded-full"
            />
          </Avatar>
        ))}
      </FlexContainer>
    </div>
  );
};
