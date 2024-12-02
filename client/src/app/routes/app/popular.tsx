import { PopularLayout } from "@/components/layouts/popular-layout"
import { LeftSidebar } from "@/components/shared/left-sidebar"
import { RightSidebar } from "@/components/shared/right-sidebar"

import { ThreadCardList } from "@/features/shared/components/thread-card-list"
import { useGetThreads } from "@/features/thread/api/get-all-threads"
import { Rooms } from "@/features/study-room/components/rooms"

import { useAuth } from "@/hooks/use-auth"


export const PopularRoute = () => {
  const { authState } = useAuth();
  const { data: threads } = useGetThreads({});

  if (!authState?.user?.id) return <p>Loading...</p>;   

  return (
    <PopularLayout LeftSidebar={LeftSidebar} RightSidebar={RightSidebar}>
    <section
      className="bg-background border-3 border-black
      md:ml-[16rem] overflow-x-hidden"
    >
        <div>
            <Rooms />
        </div>
        <div className="lg:mr-[22rem] mt-4"> 
            <ThreadCardList
                threads={threads || []}
            />
        </div>
    </section>
  </PopularLayout>
  )
}
