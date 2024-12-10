import { MainLayout } from "@/components/layouts/layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";

import { useAuth } from "@/hooks/use-auth";

import { ThreadForm } from "@/features/shared/components/create-thread-form";
import { useCreateThread } from "@/features/shared/api/create-thread";
import { useNavigate, useParams } from "react-router-dom";
import { useGetThreadByID } from "@/features/thread/api/get-thread";
import { useUpdateThread } from "@/features/thread/api/update-thread";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const CreateThreadRoute = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { threadId } = useParams();
  const { data: thread } = useGetThreadByID({ threadId: threadId || "" });
  const { mutate: createThread } = useCreateThread({
    mutationConfig: {
      onSuccess: (thread) => {
        if ((!thread.communityId || thread.communityId === "null") && (thread.topicId && thread.topicId  !== "null"))
          navigate(`/topic/${thread.topicId}`);
        else
          navigate("/");

        toast.success("Thread added successfully");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        }
      },
    },
  });
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
          user={authState.user}
        />
      </section>
    </MainLayout>
  );
};
