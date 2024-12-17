import { MainLayout } from "@/components/layouts/layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { useParams } from "react-router-dom";
import { useGetThreadByID } from "@/features/thread/api/get-thread";
import { ThreadView } from "@/features/thread/components/thread-view";
import { Comments } from "@/features/thread/components/comments";
import { Button } from "@/components/ui/button";
import { CommentForm } from "@/features/thread/components/comment-form";
import { MessageCircle } from "lucide-react";
import { CommentContextProvider } from "@/features/thread/provider/comment";
import SyncLoader from "react-spinners/SyncLoader";
import { ThreadViewRightSidebar } from "@/components/shared/thred-view-rightbar";

export const ThreadRoute = () => {
  const { id } = useParams();
  const { data: thread, isFetching } = useGetThreadByID({ threadId: id || "" });

  if (!thread || isFetching) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <SyncLoader size={20} color="#533de0" />
      </div>
    );
  }

  return (
    <CommentContextProvider>
      <MainLayout LeftSidebar={LeftSidebar} RightSidebar={ThreadViewRightSidebar}>
        <section className="">
          <div className="space-y-4 text-primary-foreground">
            <ThreadView thread={thread} />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {5} Comments
              </h2>
              <div className="gap-2 hidden md:flex ">
                <Button variant="outline" size="sm" className="text-xs">
                  Popular
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Newest
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Oldest
                </Button>
              </div>
            </div>
            <CommentForm threadId={id} placeholder="Share your thoughts..." />
            <Comments />
          </div>
        </section>
      </MainLayout>
    </CommentContextProvider>
  );
};