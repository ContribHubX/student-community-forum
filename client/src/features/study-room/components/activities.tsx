import { Timer } from "./timer"
import { Todos } from "./todos"
import { Chats } from "./chats"
import { useAuth } from "@/hooks/use-auth"


interface ActivitiesProp {
  roomId: string;
}

export const Activities = ({ roomId }: ActivitiesProp) => {
  const { authState } = useAuth();

  if (!authState.user) return <p>Loading...</p>

  return (
    <div 
      className={`flex flex-col gap-3 p-3 bg-background rounded-2xl 
        h-[78svh]  md:h-[98vh]  
      `}
      style={{
        // minHeight: "calc(100svh - 1rem)"
      }}
    >
        <Timer />
        <Todos
          userId={authState.user.id}
        />
        <Chats 
          userId={authState.user.id}
          roomId={roomId}
        />
    </div>
  )
}
