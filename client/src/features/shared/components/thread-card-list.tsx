import { ThreadCard } from "@/features/thread/components/thread-card";
import { useAuth } from "@/hooks/use-auth";
import { Thread } from "@/types";
import SyncLoader from "react-spinners/SyncLoader";

interface ThreadCardListProp {
  threads: Thread[];
}

export const ThreadCardList = ({ threads }: ThreadCardListProp) => {
  const { authState } = useAuth();

  // Temporary only
  if (!threads) {
    return <SyncLoader size={150} />;
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
