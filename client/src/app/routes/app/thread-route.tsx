import { MainLayout } from "@/components/layouts/layout";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { LeftSidebar } from "@/components/shared/left-sidebar";
import { useParams } from "react-router-dom";
import { FaBirthdayCake } from "react-icons/fa";
import communityLogo from "@/assets/thread-route/community-logo.svg";

export const ThreadRoute = () => {
  const { id } = useParams();

  return (
    <MainLayout LeftSidebar={LeftSidebar} RightSidebar={RightSidebar}>
      <p>Thread id: {id}</p>
    </MainLayout>
  );
};

const RightSidebar = () => {
  return (
    <SidebarLayout
      position="right-5"
      width={320}
      className="p-6 font-light flex flex-col gap-5 text-sm bg-primary text-primary-foreground"
    >
      <div className="font-normal text-base flex items-center gap-2">
        <img src={communityLogo} alt="" />
        <p className="">Programming Community</p>
      </div>

      <p className="text-justify text-[#888484]">
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
