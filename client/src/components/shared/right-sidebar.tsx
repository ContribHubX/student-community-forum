import arrowbutton from "@/assets/sidebar/arrow-button.svg";
import { Link } from "react-router-dom";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { UpcomingEventsList } from "@/features/thread/components/upcoming-events";
import { recentThreadData } from "@/features/shared/data/recent-thread-data";

export const RightSidebar = () => {
  return (
    <SidebarLayout
      className="hidden flex-col gap-6 lg:flex"
      width={325}
      height={"full"}
      position="right-6"
    >
      <UpcomingEventsList />

      <div
        className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 shadow-slate-400 shadow-md dark:shadow-gray-900"
        id="sidebar"
      >
        <Link to="">
          <div className="flex items-center mb-4">
            <h1>Recent Threads</h1>
            <img src={arrowbutton} alt="" className="h-6" />
          </div>
        </Link>

        {recentThreadData.map((event, index) => {
          return <RecentThread key={index} iconBgcolor="#EFF5F8" {...event} />;
        })}
      </div>
    </SidebarLayout>
  );
};

interface RecentThreadProps {
  title: string;
  author: string;
  icon: string;
  iconBgcolor: string;
}

const RecentThread = ({ title, author, icon }: RecentThreadProps) => {
  return (
    <div className="flex  gap-2">
      <div
        className={`rounded-xl flex p-4 items-center justify-center bg-container`}
      >
        <img src={icon} alt="" className="h-8 w-8" />
      </div>

      <div className="flex flex-col flex-1 justify-center">
        <p className="text-sm">{title}</p>
        <p className="text-xs text-muted-foreground justify-self-end">
          by {author}
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
