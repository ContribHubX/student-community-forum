import { Thread } from "@/types";
import { ThreadCard } from "./thread-card";

import "highlight.js/styles/github.css";
import { useAuth } from "@/hooks/use-auth";

interface ThreadViewProps {
  thread: Thread;
}

export const ThreadView = ({ thread }: ThreadViewProps) => {
  const { authState } = useAuth();

  return (
    <div className="">
      <ThreadCard thread={thread} userId={authState.user?.id || ""} />
    </div>
  );
};
