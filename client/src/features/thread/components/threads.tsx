import { ThreadCardList } from "@/features/shared/components/thread-card-list";
import { ThreadActionForm } from "@/features/shared/components/thread-action-form";

import { useAuth } from "@/hooks/use-auth";
import { useGetThreads } from "../api/get-all-threads";
import { SideBarItem } from "@/components/ui/sidebar-item";

import newest from "@/assets/sidebar/newest.svg";
import popular from "@/assets/sidebar/popular.svg";
import { MyLoader } from "@/components/shared/loader";

export const Threads = () => {
  const { authState } = useAuth();
  const { data: threads, isFetching } = useGetThreads({});

  if (!authState.user) return <p>Loading...</p>;

  if (isFetching) {
    return <MyLoader />;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="md:hidden">
        <TabbedNav />
      </div>
      <div>
        <ThreadActionForm user={authState.user} />
      </div>
      <div>
        <ThreadCardList threads={threads || []} />
      </div>
    </div>
  );
};

const TabbedNav = () => {
  return (
    <div
      className=" bg-primary text-primary-foreground rounded-2xl p-4 gap-4 shadow-slate-400 shadow-md dark:shadow-gray-900
          flex  justify-between
        "
      id="sidebar"
    >
      <SideBarItem
        title="Newest"
        description="Find the latest updates"
        icon={newest}
        iconBgcolor="primary"
        link={"/"}
        showDesc={false}
        containerStyle="text-2xl"
        descStyle="text-xs sm:text-sm"
      />
      <SideBarItem
        title="Popular"
        description="Shots featured duringasjdkashduikasd"
        icon={popular}
        iconBgcolor="#EFF5F8"
        link={"/popular"}
        showDesc={false}
        descStyle="text-xs sm:text-sm"
      />
      <SideBarItem
        title="Popular"
        description="Shots featured duringasjdkashduikasd"
        icon={newest}
        iconBgcolor="#EFF5F8"
        showDesc={false}
        descStyle="text-xs sm:text-sm"
      />
    </div>
  );
};
