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
import { subDays } from "date-fns";
import { useEffect, useState } from "react";
import { CommunityTab } from "@/types";
import { events } from "@/features/event/data/events";
import { useGetEvents } from "@/features/event/api/get-events";
import { MembersList } from "@/features/community/components/members";
import { useGetMembers } from "@/features/community/api/get-members";
import { LiveDiscussionCard } from "@/features/live-discussion/components/discussion-card";
import { useSocketProvider } from "@/hooks/use-socket-provider";

export const Community = () => {
  const { id } = useParams();
  const { authState } = useAuth();
  const [activeUsers, setActiveUsers] = useState(0);

  const { data: threads } = useGetThreadsByCommunity({ communityId: id || "" });
  
  const { data: eventsData } = useGetEvents({ communityId: id || "" });

  const { data: community } = useGetCommunityById({ id });

  const { data: members } = useGetMembers({ communityId: id || "" });

  const [tabOpen, setChangeTab] = useState<CommunityTab>("Threads");

  const { socketState } = useSocketProvider();

  //console.log(socketState?.discussions[id]?.users.length);

  useEffect(() => {
    if (!id || !socketState) return;
    setActiveUsers(socketState.discussions[id]?.users.length || 0);
    console.log(socketState.discussions[id]?.users);
  }, [id, socketState]);

  if (!community || !authState.user) {
    return <div>Loading..</div>;
  }

  const isJoined = (): boolean => {
    if (!community || !authState.user) return false;
    return community.members.some(
      (member) => member.user.id.toString() === authState.user?.id.toString(),
    );
  };

  return (
    <div className="flex flex-col text-primary-foreground bg-background min-h-screen">
      <Navbar />
      <main>
        <CommunityView
          community={community}
          userId={authState.user.id}
          onTabChange={(tab: CommunityTab) => setChangeTab(tab)}
          tabOpen={tabOpen}
          isJoined={isJoined()}
        />
        <div className="px-4 md:px-0 w-full md:w-[78%] flex flex-1 mx-auto mt-5 gap-5">
          {tabOpen === "Threads" && (
            <div className="w-full flex flex-col md:flex-row gap-8">
              <div className="min-w-[70%]">
                <div>
                  <ThreadActionForm
                    user={authState.user}
                    community={community}
                  />
                </div>
                <div className="mt-4">
                  <ThreadCardList threads={threads || []} />
                </div>
              </div>
              <aside
                className="sticky right-5 top-28 rounded-xl space-y-4"
                style={{ height: "calc(100vh - 8rem)" }}
              >
                <LiveDiscussionCard
                  communityId={community.id}
                  activeUsers={activeUsers}
                  isJoined={isJoined()}
                />

                <div className="bg-primary rounded-xl shadow-slate-400 shadow-md dark:shadow-gray-900 text-sm">
                  <p className="py-2 px-4 border-b-[0.5px] border-[#878484] border-opacity-50">
                    Details
                  </p>
                  <div className="p-4">
                    <p>{community.description}</p>
                  </div>
                </div>

                <div className="text-sm bg-primary rounded-xl shadow-slate-400 shadow-md dark:shadow-gray-900">
                  <p className="py-2 px-4 border-b-[0.5px] border-[#878484] border-opacity-50">
                    Admin
                  </p>
                  <div className="p-4 flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={community.createdBy.attachment} />
                    </Avatar>
                    <p>{community.createdBy.name}</p>
                  </div>
                </div>

                <div className="overflow-y-auto rounded-xl shadow-slate-400 shadow-md dark:shadow-gray-900">
                  <UpcomingEventsList communityId={community.id} />
                </div>
              </aside>
            </div>
          )}
          {tabOpen === "Events" && (
            <div className="w-full mx-auto">
              <EventCalendar
                events={[
                  {
                    id: "1",
                    name: "UC Intrams",
                    eventDate: subDays(new Date(), 6),
                    tags: [],
                    communityId: "dfafd",
                  },
                  {
                    id: "2",
                    name: "UC Days",
                    eventDate: subDays(new Date(), 15),
                    tags: [],
                    communityId: "dfafd",
                  },
                  ...events,
                  ...(eventsData || []),
                ]}
                communityId={community.id}
                userId={authState.user.id}
              />
            </div>
          )}
          {tabOpen === "Members" && (
            <div className="w-full mx-auto">
              <MembersList members={members || []} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
