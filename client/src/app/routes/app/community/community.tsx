import { Navbar } from "@/components/shared/navbar";
import { useGetCommunityById } from "@/features/community/api/get-community";
import { useParams } from "react-router-dom";
import { CommunityView } from "@/features/community/components/community-view";
import { Threads } from "@/features/thread/components";
import { useAuth } from "@/hooks/use-auth";
import { UpcomingEventsList } from "@/features/thread/components/upcoming-events";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const Community = () => {
  const { id } = useParams();
  const { authState } = useAuth();
  console.log(id);

  const { data: community } = useGetCommunityById(
    "f0d7d1d5-a751-44f4-b97c-a28d7d35404f",
    {},
  );

  if (!community || !authState.user) {
    return <div>Loading..</div>;
  }

  return (
    <div className="bg-background text-primary-foreground">
      <Navbar />
      <main className="">
        <CommunityView community={community} />

        <div className="w-[78%] flex mx-auto mt-5 gap-5 ">
          <div className="flex-grow">
            <Threads userId={authState.user?.id} />
          </div>

          <aside
            className="sticky right-5 w-[325px] top-28 rounded-xl space-y-4"
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
                  <AvatarImage src={community.createdBy.attachment} />
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
      </main>
    </div>
  );
};