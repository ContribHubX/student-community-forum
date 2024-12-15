import { useEffect, useState } from "react";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useNavigate, useParams } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { FaPlus } from "react-icons/fa6";
import { TiEye, TiEyeOutline } from "react-icons/ti";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { LiaUserSolid } from "react-icons/lia";

import { MyLoader } from "@/components/shared/loader";

import { TaskColumn } from "./task-column";
import { TaskStatusType, User } from "@/types";
import { useKanbanDrag } from "@/features/workspace/hooks/use-kanban-drag";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSocketProvider } from "@/hooks/use-socket-provider";
import { users } from "@/features/shared/data/users";
import { ActiveUsers } from "./active-users";

import { useGetTasks } from "../api/get-all-tasks";
import { useUpdateTask } from "../api/update-task";
import { useGetBoardMembers } from "../api/get-board-members";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useGetUsers } from "@/features/shared/api/get-all-users";
import { useAddBoardMember } from "../api/add-board-member";
import { statusColors } from "../constant";
import { useTheme } from "@/hooks/use-theme";
import { useBoardContext } from "../hooks/use-board-context";
import { IoMdArrowBack } from "react-icons/io";

// TODO napay bug ang giatay kung mo drag sa same column mo duplicate

interface KanbanBoardProp {
  toggleNavbar: () => void;
  currentUser: User;
}

export const KanbanBoard = ({ toggleNavbar, currentUser }: KanbanBoardProp) => {
  const { boardId } = useParams();

  const [boardOwner, setBoardOwner] = useState<User>({} as User);

  const { data: taskData } = useGetTasks({ boardId: boardId || "" });
  const { data: members } = useGetBoardMembers({ boardId: boardId || "" });
  const { data: allUsers } = useGetUsers({});

  const { mutate: updateTask } = useUpdateTask({});
  const { mutate: addBoardMember } = useAddBoardMember({});

  const { onDragEnd } = useKanbanDrag(taskData, updateTask, boardId);
  const { socketState } = useSocketProvider();
  const { state } = useBoardContext();
  const { isDark } = useTheme();

  const [isRealTimeCursorVisible, setIsRealTimeCursorVisible] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!socketState.socket || !socketState.socket.connected) return;

    socketState.socket.emit("client__user--join", {
      boardId,
      user: currentUser,
    });

    return () => {
      socketState.socket?.emit("client__user--left", {
        boardId,
        user: currentUser,
      });

      socketState.socket?.off("client__user--join");
      socketState.socket?.off("client__user--left");
    };
  }, [boardId, currentUser, socketState.socket]);

  useEffect(() => {
    if (!state || !boardId) return;

    const board = [...state.boards, ...state.sharedBoards].filter(
      (board) => board.id === boardId,
    )[0];
    setBoardOwner(board?.createdBy);
  }, [state, boardId, currentUser.id]);

  if (!taskData || !boardId) return <MyLoader />;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <IoMdArrowBack
        className="text-primary-foreground cursor-pointer text-2xl"
        onClick={() => navigate("/workspace")}
      />
      <div>
        <div className="canvas" />
        <div className="mt-0 w-fit mx-auto bg-primary p-2 text-xs rounded-xl flex items-center gap-1">
          <div className="w-[6px] h-[6px] bg-[#00FF00] rounded-lg" />
          <LiaUserSolid className="text-xl text-muted-foreground" />
          <p className="text-muted-foreground">
            {socketState.boards[boardId]?.length || 0}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            {users.slice(0, 4).map((user, index) => (
              <Avatar
                key={user.id}
                className={`${index === 0 ? "ml-0" : "ml-[-20px]"}`}
              >
                <AvatarImage src={user.attachment} className="object-cover" />
              </Avatar>
            ))}
            <Popover>
              <PopoverTrigger>
                <div
                  className="rounded-full w-[40px] h-[40px] flex items-center justify-center border border-accent text-accent"
                  style={
                    {
                      // color: "#533de0",
                      // backgroundColor: lighten(0.4, "#533de0"),
                    }
                  }
                >
                  <FaPlus className="text-xl font-thin " />
                </div>
              </PopoverTrigger>
              <PopoverContent className="bg-primary dark:border-gray-600 border-[1px]">
                <div className="flex flex-col gap-3">
                  {allUsers?.map((user) => {
                    return (
                      user.id !== currentUser.id && (
                        <div
                          key={user.id}
                          onClick={() => ""}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          {boardOwner && user.id !== boardOwner?.id && (
                            <>
                              <Avatar className="w-[30px] h-[30px] rounded-full">
                                <AvatarImage
                                  src={user.attachment}
                                  className="object-cover"
                                />
                              </Avatar>
                              <p className="text-[.8rem]">{user.name}</p>
                              {members?.some((mem) => mem.id === user.id) ? (
                                <div
                                  className="text-xs ml-auto rounded-full p-2"
                                  style={{
                                    color: statusColors["active"].text,
                                    backgroundColor: !isDark
                                      ? statusColors["active"].background
                                      : "#1e252b",
                                  }}
                                >
                                  joined
                                </div>
                              ) : (
                                <div
                                  className="text-xs ml-auto rounded-full p-2 bg-background border border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                                  onClick={() =>
                                    addBoardMember({
                                      memberId: user.id,
                                      boardId,
                                    })
                                  }
                                >
                                  add
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2 text-xl text-primary-foreground">
            <Select
              onValueChange={(value) => {
                setIsRealTimeCursorVisible(value === "true");
              }}
              value={isRealTimeCursorVisible.toString()}
            >
              <SelectTrigger className="flex border-none text-2xl w-8 items-center p-0 gap-3 [&>svg]:hidden">
                <div className="flex items-center gap-3">
                  {isRealTimeCursorVisible ? (
                    <TiEye className="text-green-500 hover:text-accent" />
                  ) : (
                    <TiEyeOutline className="text-red-500 hover:text-accent" />
                  )}
                  <div className="h-[20px] w-[1px] bg-muted-foreground" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-md shadow-md">
                <SelectItem
                  value="true"
                  className="hover:bg-accent hover:text-white"
                >
                  Cursor Visible
                </SelectItem>
                <SelectItem
                  value="false"
                  className="hover:bg-accent hover:text-white"
                >
                  Cursor Hidden
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="hover:bg-accent w-[30px] text-primary-foreground hover:text-white rounded-md h-[30px] flex items-center justify-center">
              <FaExpandArrowsAlt
                className=" rounded-md"
                onClick={toggleNavbar}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto ">
        <div className="mt-6 grid grid-cols-3 max-w-[1000px] gap-4 mx-auto min-w-[800px]">
          {["todo", "doing", "finished"].map((type) => (
            <Droppable key={type} droppableId={type}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[500px] flex flex-col gap-4"
                >
                  <TaskColumn
                    currentUserId={currentUser.id}
                    boardId={boardId}
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
      </div>

      <div className={`${!isRealTimeCursorVisible && "hidden"}`}>
        <ActiveUsers
          currentUser={currentUser}
          boardId={boardId}
          boardState={socketState.boards[boardId]}
        />
      </div>
    </DragDropContext>
  );
};
