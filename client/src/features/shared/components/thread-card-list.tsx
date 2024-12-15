import { ThreadCard } from "@/features/thread/components/thread-card";
import { useAuth } from "@/hooks/use-auth";
import { Thread } from "@/types";

interface ThreadCardListProp {
  threads: Thread[];
}

export const ThreadCardList = ({ threads }: ThreadCardListProp) => {
  const { authState } = useAuth();

  // Temporary only
  if (!threads || !authState.user || !threads.length) {
    return <p>Loading...</p>;
  } 

  return (
    <div className="flex flex-col items-start gap-4">
      {threads?.map((thread) => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          userId={authState?.user?.id || ""}
        />
      ))}
    </div>
  );
};
