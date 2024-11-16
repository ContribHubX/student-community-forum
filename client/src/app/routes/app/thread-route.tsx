import { MainLayout } from "@/components/layouts/layout";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { useParams } from "react-router-dom";
import { FaBirthdayCake } from "react-icons/fa";
import communityLogo from "@/assets/thread-route/community-logo.svg";
import { useGetThreadByID } from "@/features/thread/api/get-thread";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { IoMdHeart } from "react-icons/io";
import { BiDislike } from "react-icons/bi";
import { MdInsertComment } from "react-icons/md";

export const ThreadRoute = () => {
  const { id } = useParams();

  const { data: thread } = useGetThreadByID(id, {});
  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout LeftSidebar={LeftSidebar} RightSidebar={RightSidebar}>
      <section
        className="bg-primary
                  md:mr-[340px] p-5 rounded-xl
                  lg:ml-[270px] "
      >
        {/* User */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Avatar className="">
              <AvatarImage
                src={thread?.createdBy?.attachment}
                className="rounded-full h-10"
              />
            </Avatar>
            <div>
              <p className="text-primary-foreground">{thread?.createdBy.name}</p>
              <p>{thread?.createdBy.createdAt?.toDateString()}</p>
              <p className="text-muted-foreground text-xs">18 hours ago</p>
            </div>
          </div>

          <div className="">
            {" "}
            {/* Content */}
            <h1 className="text-base text-primary-foreground">{thread?.title}</h1>
            <div
              className="ql-editor text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: thread?.content }}
            />
          </div>

          {/* Reactions */}
          <div className="flex gap-6">
            <Reaction
              icon={<IoMdHeart className="text-accent" />}
              count={325}
            />
            <Reaction icon={<BiDislike />} count={57} />
            <Reaction icon={<MdInsertComment />} count={325} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

interface ReactionProps {
  count: number;
  icon: JSX.Element;
  onClick?: () => void;
}

const Reaction = ({ count, icon, onClick }: ReactionProps) => {
  return (
    <div
      className="cursor-pointer flex items-center gap-1 text-[#808080] text-base"
      onClick={onClick}
    >
      <div className="border border-[#505050] px-4 py-2 rounded-[40px]">
        {icon}
      </div>

      <p className="font-light text-sm">{count}</p>
    </div>
  );
};

const RightSidebar = () => {
  return (
    <SidebarLayout
      position="right-5"
      width={320}
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
