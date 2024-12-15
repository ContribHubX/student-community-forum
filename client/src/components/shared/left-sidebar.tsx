import newest from "@/assets/sidebar/newest.svg";
import popular from "@/assets/sidebar/popular.svg";

import { SideBarItem } from "../ui/sidebar-item";
import { popularTagsData } from "@/features/shared/data/topic-group";
import { useGetTopics } from "@/features/topic/api";

import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useGetCommunities } from "@/features/community/api/get-communities";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LeftSidebar = () => {
  const { data: topics } = useGetTopics({});
  const { data: communities } = useGetCommunities({});

  const navigate = useNavigate();

  return (
      <ScrollArea className="h-full py-4 pr-3">
        <div className="w-full flex flex-col gap-4 ">
          <div
            className="bg-primary text-primary-foreground rounded-2xl p-4 gap-4 shadow-slate-400 shadow-md dark:shadow-gray-900
              flex flex-col
            "
            id="sidebar"
          >
            <SideBarItem
              title="Newest"
              description="Find the latest updates"
              icon={newest}
              iconBgcolor="primary"
              link={"/"}
            />
            <SideBarItem
              title="Popular"
              description="Shots featured duringasjdkashduikasd"
              icon={popular}
              iconBgcolor="#EFF5F8"
              link={"/popular"}
            />
            <SideBarItem
              title="Popular"
              description="Shots featured duringasjdkashduikasd"
              icon={newest}
              iconBgcolor="#EFF5F8"
            />
          </div>
          <div
            className=" bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 shadow-slate-400 shadow-md dark:shadow-gray-900"
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
              topics?.slice(0, popularTagsData.length).map((topics, index) => {
                return (
                  <SideBarItem
                    key={topics.id}
                    title={topics.name.replace(" ", "_").toLowerCase()}
                    description={popularTagsData[index].description}
                    icon={popularTagsData[index].icon}
                    iconBgcolor={popularTagsData[index].iconBgColor}
                    link={`/topic/${topics.id}`}
                  />
                );
              })}
          </div>
          <div
            className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4
            shadow-slate-400 shadow-md dark:shadow-gray-900 "
            id="sidebar"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium">Explore Groups</h1>
              <FaArrowRightLong
                className="text-base cursor-pointer hover:text-accent"
                onClick={() => navigate("/community/all")}
              />
            </div>
            {communities && communities.length && communities?.slice(0, 5).map((popularGroupData, index) => {
              return (
                <SideBarItem
                  key={index}
                  title={
                    "c/" + popularGroupData.name.replace(" ", "_").toLowerCase()
                  }
                  description={popularGroupData.description}
                  icon={popularGroupData.icon}
                  iconBgcolor="#EFF5F8"
                  imgStyle="rounded-lg"
                  link={`/community/${popularGroupData.id}`}
                />
              );
            })}
          </div>
        </div>
      </ScrollArea>
    // <aside
    //   className="hidden fixed flex-col rounded-md w-[250px] gap-4 overflow-y-scroll shadow-sm
    //   md:flex"
    //   id="sidebar-container"
    //   style={{ height: "calc(100vh - 8rem)" }}
    // >

    // </aside>
  );
};
