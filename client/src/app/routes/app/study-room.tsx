import { Lobby } from "@/features/study-room/components/lobby";
import { useAuth } from "@/hooks/use-auth";

export const StudyRoomRoute = () => {
  const { authState } = useAuth();

  if (!authState?.user?.id) return <p>Loading...</p>;

  return (
    <section className="h-svh overflow-hidden">
      <div>
        <Lobby user={authState.user} />
      </div>
    </section>
  );
};
