import { ThreadCard } from "@/features/thread/components/thread-card";
import { Thread } from "@/types";

interface ThreadCardListProp {
  threads: Thread[]
}

export const ThreadCardList = ({ threads }: ThreadCardListProp) => {

  // Temporary only
  if (!threads) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </div>
  );
};
