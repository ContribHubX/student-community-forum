import { ThreadCardList } from "@/features/shared/components/thread-card-list";
import { ThreadActionForm } from "@/features/shared/components/thread-action-form";

import { useAuth } from "@/hooks/use-auth";
import { useGetThreads } from "../api/get-all-threads";

export const Threads = () => {
  const { authState } = useAuth();
  const { data: threads } = useGetThreads({});

  if (!authState.user) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <ThreadActionForm user={authState.user} />
      </div>
      <div>
        <ThreadCardList threads={threads || []} />
      </div>
    </div>
  );
};
