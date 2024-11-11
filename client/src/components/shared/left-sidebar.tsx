import newest from "@/assets/sidebar/newest.svg";
import popular from "@/assets/sidebar/popular.svg";
import design from "@/assets/sidebar/topics/design.svg";
import bitcoin from "@/assets/sidebar/topics/bitcoin.svg";
import innovation from "@/assets/sidebar/topics/innovation.svg";
import tutorial from "@/assets/sidebar/topics/tutorial.svg";
import business from "@/assets/sidebar/topics/business.svg";
import javascript from "@/assets/sidebar/topics/javascript.svg";

import bitcoin2 from "@/assets/sidebar/groups/bitcoin02.svg";
import blogging from "@/assets/sidebar/groups/blogging.svg";
import uc from "@/assets/sidebar/groups/uc.svg";
import uccebu from "@/assets/sidebar/groups/universityofcebu.svg";

import { Link } from "react-router-dom";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";

const popularTagsData = [
  {
    title: "#javascript",
    description: "82,645 posts",
    icon: javascript,
    iconBgColor: "#5A4F43", // Color for #javascript
  },
  {
    title: "#bitcoin",
    description: "75,922 posts",
    icon: bitcoin,
    iconBgColor: "#473E3B", // Color for #bitcoin
  },
  {
    title: "#design",
    description: "65,523 posts",
    icon: design,
    iconBgColor: "#444F5F", // Color for #design
  },
  {
    title: "#innovation",
    description: "49,029 posts",
    icon: innovation,
    iconBgColor: "#574D42", // Color for #innovation
  },
  {
    title: "#tutorial",
    description: "65,523 posts",
    icon: tutorial,
    iconBgColor: "#335248", // Color for #tutorial
  },
  {
    title: "#business",
    description: "62,945 posts",
    icon: business,
    iconBgColor: "#46475B", // Color for #business
  },
];

const popularGroupsData = [
  {
    title: "c/universityofcebu",
    description: "82,645 posts",
    icon: uccebu,
    iconBgColor: "white", // Example color
  },
  {
    title: "c/bitcoin",
    description: "62,845 posts",
    icon: bitcoin2,
    iconBgColor: "white", // Example color
  },
  {
    title: "c/programming",
    description: "62,645 posts",
    icon: "path/to/programming-icon.svg",
    iconBgColor: "white", // Example color
  },
  {
    title: "c/blogging",
    description: "52,645 posts",
    icon: blogging,
    iconBgColor: "white", // Example color
  },
  {
    title: "c/uc",
    description: "82,645 posts",
    icon: uc,
    iconBgColor: "#ffffff", // Example color
  },
];

export const LeftSidebar = () => {
  return (
    <SidebarLayout
      className="hidden flex-col gap-6
      lg:flex"
      width={250}
      position="left-50"
    >
      <div
        className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 shadow-slate-400 shadow-md dark:shadow-gray-900"
        id="sidebar"
      >
        <SideBarItem
          title="Newest and Recent"
          description="Find the latest updates.."
          icon={newest}
          iconBgcolor="#EFF5F8"
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
        <h1>Popular Topics</h1>

        {popularTagsData.map((popularTag, index) => {
          return (
            <SideBarItem
              key={index}
              title={popularTag.title}
              description={popularTag.description}
              icon={popularTag.icon}
              iconBgcolor={popularTag.iconBgColor}
            />
          );
        })}
      </div>

      <div
        className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 
        shadow-slate-400 shadow-lg dark:shadow-gray-900"
        id="sidebar"
      >
        <h1>Explore Groups</h1>

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

interface SidebarItemProps {
  title: string;
  icon: string;
  description: string;
  iconBgcolor: string;
}

const SideBarItem = ({
  title,
  icon,
  description,
  iconBgcolor,
}: SidebarItemProps) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
  };
  return (
    <Link to="">
      <div className="flex gap-2">
        <div
          className={`rounded-xl h-10 w-10 flex items-center justify-center`}
          style={{ backgroundColor: iconBgcolor }}
        >
          <img src={icon} alt="" className="h-6" />
        </div>

        <div>
          <p className="text-sm">{truncateText(title, 23)}</p>
          <p className="text-xs text-muted-foreground">
            {truncateText(description, 22)}
          </p>
        </div>
      </div>
    </Link>
  );
};
