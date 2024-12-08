import { Navbar } from "@/components/shared/navbar";
import { useGetCommunityById } from "@/features/community/api/get-community";
import { useParams } from "react-router-dom";
import { CommunityView } from "@/features/community/components/community-view";
import { useAuth } from "@/hooks/use-auth";
import { UpcomingEventsList } from "@/features/thread/components/upcoming-events";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ThreadActionForm } from "@/features/shared/components/thread-action-form";
import { ThreadCardList } from "@/features/shared/components/thread-card-list";
import { useGetThreadsByCommunity } from "@/features/community/api/get-threads";
import { EventCalendar } from "@/features/event/event-calendar";
import { subDays } from "date-fns/subDays";
import { useState } from "react";
import { CommunityTab } from "@/types";
import { events } from "@/features/event/data/events";
import { useGetEvents } from "@/features/event/api/get-events";

export const Community = () => {
  const { id } = useParams();
  const { authState } = useAuth();  
  const { data: threads } = useGetThreadsByCommunity({ communityId: id || "" });
  const [tabOpen, setChangeTab] = useState<CommunityTab>("Threads");
  const { data: eventsData } = useGetEvents({ communityId: id || "" });

  const { data: community } = useGetCommunityById({ id })

  if (!community || !authState.user) {
    return <div>Loading..</div>;
  }

  return (
    <div className="bg-background text-primary-foreground">
      <Navbar />
      <main className="">
        <CommunityView 
          community={community} 
          userId={authState.user.id}
          onTabChange={(tab: CommunityTab) => setChangeTab(tab)}
          tabOpen={tabOpen}
        />

        <div className="w-[78%] flex flex-1  mx-auto mt-5 gap-5">
          {tabOpen === "Threads" ? (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="min-w-[70%]">
                <div>
                  <ThreadActionForm
                  user={authState.user}
                />
                </div>
                <div>
                  <ThreadCardList threads={threads || []} />
                </div>
              </div>


              <aside
                className="sticky right-5 top-28 rounded-xl space-y-4"
                style={{ height: "calc(100vh - 8rem)" }}
              >
                <div
                  className="font-light bg-primary rounded-xl shadow-slate-400 shadow-md dark:shadow-gray-900
                text-sm "
                >
                  <p className=" py-2 px-4 border-b-[0.5px] border-[#878484] border-opacity-50">
                    Details
                  </p>
                  <div className="p-4">
                    <p>{community.description}</p>
                  </div>
                </div>

                <div
                  className="text-sm font-light bg-primary rounded-xl shadow-slate-400 shadow-md dark:shadow-gray-900
                "
                >
                  <p className="py-2 px-4  border-b-[0.5px] border-[#878484] border-opacity-50">
                    Admin
                  </p>
                  <div className="p-4 flex items-center gap-2">
                    <Avatar>
                      <AvatarImage 
                        src={community.createdBy.attachment} />
                    </Avatar>
                    <p>{community.createdBy.name}</p>
                  </div>
                </div>

                <div
                  className="max-h-[450px] overflow-y-auto rounded-xl
                shadow-slate-400 shadow-md dark:shadow-gray-900"
                >
                  <UpcomingEventsList />
                </div>
              </aside>
            </div>
          ): (
            <div className="w-full mx-auto">
              <EventCalendar 
                  events={[
                    {
                      id: "1",
                      name: "UC Intrams",
                      eventDate: subDays(new Date(), 6),
                      tags: ["sports", "university"],
                      communityId: "dfafd"
                    },
                    {
                      id: "2",
                      name: "UC Days",
                      eventDate: subDays(new Date(), 15),
                      tags: ["celebration", "university"],
                      communityId: "dfafd"
                    },
                    ...events, ...eventsData || [] ]}
                    communityId={community.id}
                    userId={authState.user.id}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
