import { Timer } from "./timer";
import { Todos } from "./todos";
import { Chats } from "./chats";
import { useAuth } from "@/hooks/use-auth";

interface ActivitiesProp {
  roomId: string;
}

export const Activities = ({ roomId }: ActivitiesProp) => {
  const { authState } = useAuth();

  if (!authState.user) return <p>Loading...</p>;

  return (
    <div
      className={`gap-3 p-3 md:bg-background rounded-2xl 
        sm:h-[78svh]  md:h-[98vh]
        grid grid-cols-1 
        sm:grid-cols-2
        md:grid-cols-1
      `}
      style={
        {
          // minHeight: "calc(100svh - 1rem)"
        }
      }
    >
      <Timer roomId={roomId} />
      <Todos userId={authState.user.id} />
      <Chats userId={authState.user.id} roomId={roomId} />
    </div>
  );
};