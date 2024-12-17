import { LeftSidebar } from "@/components/shared/left-sidebar";
import { ThreadCardList } from "@/features/shared/components/thread-card-list";
import { useGetThreads } from "@/features/thread/api/get-all-threads";
import { Rooms } from "@/features/study-room/components/rooms";
import { CommunityInsightsBar } from "@/components/shared/insight-bar";

import { MainLayout } from "@/components/layouts/layout";
import { Thread } from "@/types";
import { MyLoader } from "@/components/shared/loader";
import { useAuth } from "@/hooks/use-auth";

export const PopularRoute = () => {
  const { data: threads } = useGetThreads({});

    const { authState } = useAuth();

  const sortedThreads = (threads || []).sort(
    (a: Thread, b: Thread) =>
      b.likeCount + b.dislikeCount - (a.likeCount + a.dislikeCount),
  );

  if (!threads) return <MyLoader />

  return (
    <MainLayout
      LeftSidebar={LeftSidebar}
      className="overflow-x-hidden"
    >
      <section
        className="bg-background border-3"
      >
        <div>
          <Rooms />
        </div>
        <div className="flex flex-col lg:flex-row mt-2 gap-4 
            md:mr-[15rem]
            lg:mr-[16rem]"
        >
          <div className="">
            <ThreadCardList threads={sortedThreads || []} />
          </div>
          <div className="">
              <CommunityInsightsBar 
                userId={authState.user?.id || ""}
              />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
