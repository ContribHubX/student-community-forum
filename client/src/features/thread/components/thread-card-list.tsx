import { ThreadCard } from "./thread-card";
import { useGetThreads } from "../api/get-all-threads";

export const ThreadCardList = () => {
  const { data: threads } = useGetThreads({});

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
