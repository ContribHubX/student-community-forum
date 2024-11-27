import { useEffect } from "react";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";

import { FaPlus } from "react-icons/fa6";
import { TiAttachmentOutline } from "react-icons/ti";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import { LiaUserSolid } from "react-icons/lia";

import { TaskColumn } from "./task-column";
import { TaskStatusType, User } from "@/types";
import { useKanbanDrag } from "@/features/workspace/hooks/use-kanban-drag";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSocketProvider } from "@/hooks/use-socket-provider";

import { useGetTasks } from "../api/get-all-tasks";
import { useUpdateTask } from "../api/update-task";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useGetBoardMembers } from "../api/get-board-members";

import { users } from "@/features/shared/data/users";
import { ActiveUsers } from "./active-users";



// TODO napay bug ang giatay kung mo drag sa same column mo duplicate

interface KanbanBoardProp {
  toggleNavbar: () => void,
  currentUser: User
}

export const KanbanBoard = ({ toggleNavbar, currentUser }: KanbanBoardProp) => {
  const { boardId } = useParams();

  const { data: taskData } = useGetTasks({ boardId: boardId || "" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { data: members } = useGetBoardMembers({ boardId: boardId || "" })

  const { mutate: updateTask } = useUpdateTask({});
  const { onDragEnd } = useKanbanDrag(taskData, updateTask, boardId);
  
  const { socketState } = useSocketProvider();

  console.log(socketState.boards)

  useEffect(() => {
    if (!socketState.socket || !socketState.socket.connected)
        return;

    socketState.socket.emit('client__user--join', { boardId, user: currentUser });

    return () => {
      socketState.socket?.emit('client__user--left', { boardId, user: currentUser });

      socketState.socket?.off('client__user--join');
      socketState.socket?.off('client__user--left');
    }
  }, [boardId, currentUser, socketState.socket])


  if (!taskData || !boardId) return <p>Loading...</p>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>

        <div className="canvas" />

        <div className="w-fit mx-auto bg-primary p-2 text-xs rounded-xl flex items-center gap-1">
          <div 
            className="w-[6px] h-[6px] bg-[#00FF00] rounded-lg"
          />
          <LiaUserSolid className="text-xl text-muted-foreground" />
          <p className="text-muted-foreground">{socketState.boards[boardId]?.length || 0}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {users.slice(0, 4).map((user, index) => (
              <Avatar
                key={user.id}
                className={`${index === 0 ? 'ml-0' : 'ml-[-20px]'}`}
              >
                <AvatarImage
                  src={user.attachment}
                  className="object-cover"
                />
              </Avatar>
            ))}
            <div
              className="rounded-full w-[40px] h-[40px] flex items-center justify-center border border-accent text-accent"
              style={{
                // color: "#533de0",
                // backgroundColor: lighten(0.4, "#533de0"),
              }}
            >
              <FaPlus
                className="text-xl font-thin "
              />
            </div>
          </div>
  
          <div className="flex items-center gap-3 text-xl text-primary-foreground">
              <div className="flex items-center gap-3 ">
                <TiAttachmentOutline className="hover:text-accent" />
                <div className="h-[20px] w-[1px] bg-muted-foreground " />
              </div>
              <div className="hover:bg-accent w-[30px]  text-primary-foreground hover:text-white rounded-md h-[30px] flex items-center justify-center">
                <BsFillGridFill className="rounded-md" />
              </div>
              <div className="hover:bg-accent w-[30px] text-primary-foreground hover:text-white rounded-md h-[30px] flex items-center justify-center">
                <FaExpandArrowsAlt 
                  className=" rounded-md"
                  onClick={toggleNavbar}  
                />
              </div>
          </div>
        </div>

      </div>

      <div className="mt-6 grid grid-cols-3 max-w-[1000px] gap-4 mx-auto">
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

      <ActiveUsers
        currentUser={currentUser}
        boardId={boardId}
        boardState={socketState.boards[boardId]}
      />
    </DragDropContext>
  );
};
