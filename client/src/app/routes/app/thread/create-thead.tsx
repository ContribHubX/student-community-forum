import { MainLayout } from "@/components/layouts/layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";

import { useAuth } from "@/hooks/use-auth";

import { ThreadForm } from "@/features/shared/components/create-thread-form";
import { useCreateThread } from "@/features/shared/api/create-thread";
import { useParams } from "react-router-dom";
import { useGetThreadByID } from "@/features/thread/api/get-thread";
import { useUpdateThread } from "@/features/thread/api/update-thread";

export const CreateThreadRoute = () => {
  const { authState } = useAuth();
  const { threadId } = useParams();
  const { data: thread } = useGetThreadByID(threadId, {});
  const { mutate: createThread } = useCreateThread({});
  const { mutate: updateThread } = useUpdateThread({});

  if (!authState?.user?.id) return <p>Loading...</p>;

  const handleCreateThread = (data: FormData) => {
    if (!threadId || threadId === "create") {
      createThread(data);
      return;
    }

    data.append("threadId", threadId);
    updateThread(data);
  };

  return (
    <MainLayout LeftSidebar={LeftSidebar}>
      <section
        className="bg-background border-3 border-black
        md:ml-[16rem] 
        "
      >
        <ThreadForm
          thread={thread}
          handleFormSubmit={handleCreateThread}
          userId={authState.user.id}
        />
      </section>
    </MainLayout>
  );
};
