import { LeftSidebar } from "@/components/shared/left-sidebar";
import { ThreadCardList } from "@/features/shared/components/thread-card-list";
import { useGetThreads } from "@/features/thread/api/get-all-threads";
import { Rooms } from "@/features/study-room/components/rooms";

import { MainLayout } from "@/components/layouts/layout";
import { Thread } from "@/types";

export const PopularRoute = () => {
  const { data: threads } = useGetThreads({});

  const sortedThreads = (threads || []).sort(
    (a: Thread, b: Thread) =>
      b.likeCount + b.dislikeCount - (a.likeCount + a.dislikeCount),
  );

  return (
    <MainLayout
      LeftSidebar={LeftSidebar}
      // RightSidebar={}
      className="overflow-x-hidden"
    >
      <section
        className="bg-background border-3 border-black 
      "
      >
        <div>
          <Rooms />
        </div>
        <div className="lg:mr-[22rem] mt-4 ">
          <ThreadCardList threads={sortedThreads || []} />
        </div>
      </section>
    </MainLayout>
  );
};
