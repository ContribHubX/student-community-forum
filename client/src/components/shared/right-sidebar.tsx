import arrowbutton from "@/assets/sidebar/arrow-button.svg";
import { Link, useNavigate } from "react-router-dom";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { UpcomingEventsList } from "@/features/thread/components/upcoming-events";
import { useGetThreads } from "@/features/thread/api/get-all-threads";

import { ScrollArea } from "../ui/scroll-area";

import { shuffle } from "@/utils";
import { Thread } from "@/types";

export const RightSidebar = () => {
  const { data: threads } = useGetThreads({});

  // Ensure threads is an array before calling slice
  const shuffledThreads = Array.isArray(threads) ? shuffle(threads.slice(0, 5)) : [];

  return (
    <ScrollArea className="h-full  pr-4">
      <SidebarLayout
        className="flex-col gap-6 lg:flex
                   lg:w-[245px]
                   xl:w-[290px]
                  
      
        "
        height={"full"}
        position="right-6"
      >
        <UpcomingEventsList />
        <div
          className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 shadow-slate-400 shadow-md dark:shadow-gray-900"
          id="sidebar"
        >
          <Link to="">
            <div className="flex items-center mb-1">
              <h1 className="text-sm font-medium">Recent Threads</h1>
              <img src={arrowbutton} alt="" className="h-6" />
            </div>
          </Link>
          {shuffledThreads?.map((thread) => {
            return <RecentThread key={thread.id} thread={thread} />;
          })}
        </div>
      </SidebarLayout>
    </ScrollArea>
  );
};

interface RecentThreadProps {
  thread: Thread;
}

const RecentThread = ({ thread }: RecentThreadProps) => {
  const navigate = useNavigate();
  const attachment =
    thread.attachment !== null && thread.attachment !== "null"
      ? thread.attachment
      : "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/3bb5f691632079.5e372adaa9f70.png";

  if (!thread) return <p>Loading...</p>;

  return (
    <div 
      className="flex gap-4 cursor-pointer"
      onClick={() => navigate(`/thread/${thread.id}`)}
    >
      <div
        className={`rounded-lg flex w-[80px] h-[60px] items-center justify-center bg-container`}
      >
        <img
          src={attachment}
          alt="attachment"
          className="h-full w-full rounded-lg"
        />
      </div>

      <div className="flex flex-col flex-1 justify-center">
        <p className="text-sm">{thread.title}</p>
        <p className="text-xs text-muted-foreground justify-self-end">
          by {thread.createdBy.name}
        </p>
      </div>

      <Link to="" className="self-center">
        <img src={arrowbutton} alt="" className="h-5 w-5" />
      </Link>
    </div>
  );
};

// ===BACKUP===
// ============
// const SideBarItem = ({ title, icon, location, date, month, tags }: SidebarItemProps) => {
//   const truncateText = (text: string, maxLength: number) => {
//     return text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
//   };
//   return (
//     <Link to="">
//       <div className="flex-row">
//         <div>
//           <p className="text-sm">{truncateText(title, 23)}</p>
//         </div>
//         <div>
//           {/* <img src={icon} alt="" className="h-6 w-6" /> */}
//           <p>Test</p>
//           <p className="text-xs text-muted-foreground">
//             {truncateText(location, 22)}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// };
