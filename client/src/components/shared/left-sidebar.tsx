import newest from "@/assets/sidebar/newest.svg";
import popular from "@/assets/sidebar/popular.svg";

import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { SideBarItem } from "../ui/sidebar-item";
import {
  popularTagsData,
  popularGroupsData,
} from "@/features/shared/data/topic-group";
import { useGetTopics } from "@/features/topic/api";

import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export const LeftSidebar = () => {
  const { data: topics } = useGetTopics({});
  const navigate = useNavigate();

  return (
    <SidebarLayout
      className="hidden flex-col gap-6
      lg:flex"
      width={230}
      height={"full"}
      position="left-50"
    >
      <div
        className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 shadow-slate-400 shadow-md dark:shadow-gray-900"
        id="sidebar"
      >
        <SideBarItem
          title="Newest and Recent"
          description="Find the latest updates"
          icon={newest}
          iconBgcolor="primary"
        />
        <SideBarItem
          title="Popular of the day"
          description="Shots featured duringasjdkashduikasd"
          icon={popular}
          iconBgcolor="#EFF5F8"
        />
        <SideBarItem
          title="Popular of the day"
          description="Shots featured duringasjdkashduikasd"
          icon={newest}
          iconBgcolor="#EFF5F8"
        />
      </div>

      <div
        className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 shadow-slate-400 shadow-md dark:shadow-gray-900"
        id="sidebar"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-medium">Popular Topics</h1>
          <FaArrowRightLong 
            className="text-base cursor-pointer hover:text-accent"
            onClick={() => navigate("/topic-library")}  
          />
        </div>

        {topics &&
          topics.length > 0 &&
          topics.slice(0, popularTagsData.length).map((topics, index) => {
            return (
              <SideBarItem
                key={topics.id}
                title={topics.name.replace(" ", "_").toLowerCase()}
                description={popularTagsData[index].description}
                icon={popularTagsData[index].icon}
                iconBgcolor={popularTagsData[index].iconBgColor}
              />
            );
          })}
      </div>

      <div
        className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 
        shadow-slate-400 shadow-md dark:shadow-gray-900"
        id="sidebar"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-medium">Explore Groups</h1>
          <FaArrowRightLong 
            className="text-base cursor-pointer hover:text-accent"
            onClick={() => navigate("/community/all")} 
          />
        </div>

        {popularGroupsData.map((popularGroupData, index) => {
          return (
            <SideBarItem
              key={index}
              title={popularGroupData.title}
              description={popularGroupData.description}
              icon={popularGroupData.icon}
              iconBgcolor="#EFF5F8"
            />
          );
        })}
      </div>
    </SidebarLayout>
    // <aside
    //   className="hidden fixed flex-col rounded-md w-[250px] gap-4 overflow-y-scroll shadow-sm
    //   md:flex"
    //   id="sidebar-container"
    //   style={{ height: "calc(100vh - 8rem)" }}
    // >

    // </aside>
  );
};
