// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { SideBarItem } from "@/components/ui/sidebar-item";

import newest from "@/assets/sidebar/newest.svg";
import question from "@/assets/sidebar/question.svg";
import brain from "@/assets/sidebar/brain.svg";

export const Aside = () => {
  return (
    <SidebarLayout
      className="flex-col gap-6
        lg:flex
        md:w-[230px] py-4 pr-4
      "
      height={"full"}
      position="left-50"
    >
      <div
        className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-2 shadow-slate-400 shadow-md dark:shadow-gray-900
            md:w-[230px]  
          "
        id="sidebar"
      >
        <SideBarItem
          title="Questions for you"
          description="Find the interestin questions"
          icon={question}
          iconBgcolor="primary"
          containerStyle="hover:bg-background p-2"
          link="/question"
          descStyle="hidden md:block"
        />
        <SideBarItem
          title="Answer requests"
          description="Request or answer"
          icon={brain}
          iconBgcolor="#EFF5F8"
          containerStyle="hover:bg-background p-2"
          link="/question/request"
          descStyle="hidden md:block"
        />
        <SideBarItem
          title="Popular of the day"
          description="Shots "
          icon={newest}
          iconBgcolor="#EFF5F8"
          containerStyle="hover:bg-background p-2"
          descStyle="hidden md:block"
        />
      </div>
    </SidebarLayout>
  );
};
