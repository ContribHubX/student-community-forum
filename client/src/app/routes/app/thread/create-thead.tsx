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
import { updateThreadMutationConfig } from "@/features/thread/optimistic-mutations";
import { useQueryClient } from "@tanstack/react-query";

export const CreateThreadRoute = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { threadId } = useParams();
  const { data: thread } = useGetThreadByID({ threadId: threadId || "" });
  const queryClient = useQueryClient();

  const { mutate: createThread } = useCreateThread({
    mutationConfig: {
      onSuccess: (thread) => {
        if (
          (!thread.communityId || thread.communityId === "null") &&
          thread.topicId &&
          thread.topicId !== "null"
        ) {
          navigate(`/topic/${thread.topicId}`);
        } else if (thread.communityId) {
          navigate(`/community/${thread.communityId}`);
        } else navigate("/");

        toast.success("Thread added successfully");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        }
      },
    },
  });

  const updateCallback = () => {
    toast.success("Post edited successfully");
    navigate("/");
  };

  const { mutate: updateThread } = useUpdateThread({
    mutationConfig: updateThreadMutationConfig(queryClient, updateCallback),
  });

  if (!authState?.user?.id) return <p>Loading...</p>;

  const handleCreateThread = (data: FormData) => {
    if (!threadId || threadId === "create" || threadId.startsWith("create_")) {
      console.log("data: ", data);
      createThread(data);
      return;
    }

    data.append("threadId", threadId);
    updateThread(data);
  };

  const communityId = threadId?.split("_")[1];

  return (
    <MainLayout
      LeftSidebar={LeftSidebar}
      contentStyle="
            md:ml-[16rem]
            lg:mr-0
            xl:mr-0
      "
    >
      <section className="bg-background border-3">
        <ThreadForm
          thread={thread}
          handleFormSubmit={handleCreateThread}
          user={authState.user}
          initialCommunity={
            threadId?.startsWith("create_") ? communityId : undefined
          }
        />
      </section>
    </MainLayout>
  );
};
