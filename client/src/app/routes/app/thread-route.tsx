import { MainLayout } from "@/components/layouts/layout";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { useParams } from "react-router-dom";
import { FaBirthdayCake } from "react-icons/fa";
import communityLogo from "@/assets/thread-route/community-logo.svg";
import { useGetThreadByID } from "@/features/thread/api/get-thread";
import { ThreadView } from "@/features/thread/components/thread-view";
import { CommentList } from "@/features/thread/components/comment-list";

export const ThreadRoute = () => {
  const { id } = useParams();

  const { data: thread, isFetching } = useGetThreadByID(id, {});

  if (!thread || isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout LeftSidebar={LeftSidebar} RightSidebar={RightSidebar}>
      <section
        className="
                  md:ml-[16rem] lg:mr-[22rem]"
      >
        <div className="space-y-4">
          <ThreadView thread={thread} />
          <CommentList threadId={thread.id} />
        </div>
      </section>
    </MainLayout>
  );
};

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
