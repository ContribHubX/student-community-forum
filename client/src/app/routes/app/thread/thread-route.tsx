import { MainLayout } from "@/components/layouts/layout";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { useParams } from "react-router-dom";
import { FaBirthdayCake } from "react-icons/fa";
import communityLogo from "@/assets/thread-route/community-logo.svg";
import { useGetThreadByID } from "@/features/thread/api/get-thread";
import { ThreadView } from "@/features/thread/components/thread-view";
import { Comments } from "@/features/thread/components/comments";
import { Button } from "@/components/ui/button";
import { CommentForm } from "@/features/thread/components/comment-form";
import { MessageCircle } from "lucide-react";
import { CommentContextProvider } from "@/features/thread/provider/comment";

export const ThreadRoute = () => {
  const { id } = useParams();
  const { data: thread, isFetching } = useGetThreadByID({ threadId: id || "" });

  if (!thread || isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <CommentContextProvider>
      <MainLayout LeftSidebar={LeftSidebar} >
        <section
          className="
                    md:ml-[16rem] lg:mr-[22rem]"
        >
          <div className="space-y-4 text-primary-foreground">
            <ThreadView thread={thread} />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {5} Comments
              </h2>
              <div className="flex gap-2">
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
            <CommentForm
              threadId={id}
              placeholder="Share your thoughts..."
              
            />
            <Comments />
          </div>
        </section>
      </MainLayout>
    </CommentContextProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RightSidebar = () => {
  return (
    <SidebarLayout
      position="right-5"
      width={325}
      className="p-6 font-light flex-col gap-5 text-sm bg-primary text-primary-foreground
      hidden
      md:flex"
    >
      <div className="font-normal text-base flex items-center gap-2">
        <img src={communityLogo} alt="" />
        <p className="">Programming Community</p>
      </div>

      <p className="text-justify text-muted-foreground">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium,
        suscipit quaerat consequatur ipsam minus, beatae vel aut odio dolore
        magni iste provident consectetur sit facilis recusandae, dolorem ipsum
        aperiam voluptate quia perspiciatis. Aliquid nemo ad libero. Qui
        adipisci perferendis doloremque quasi nemo deleniti placeat, corporis
        repellendus ipsam explicabo, aspernatur exercitationem.
      </p>

      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <FaBirthdayCake className="text-accent" />
          <p>Created August 3, 2022</p>
        </div>

        <div className="flex gap-2 items-center">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <p>420 users online</p>
        </div>
      </div>
    </SidebarLayout>
  );
};
