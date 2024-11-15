//right-sidebar

import csps from "@/assets/sidebar/csps-logo.png";
import uc from "@/assets/sidebar/groups/uc.svg";
import arrowbutton from "@/assets/sidebar/arrow-button.svg";

import { Link } from "react-router-dom";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";

const upcomingEventsData = [
  {
    title: "Intramurals 2024",
    location: "UC - Sanciangko, Cebu",
    icon: uc,
    date: "7",
    month: "FEB",
    tags: ["university", "intrams", "cebu"]
  },
  {
    title: "Aquaintance 2024",
    location: "UC - Sanciangko, Cebu",
    icon: csps,
    date: "3",
    month: "FEB",
    tags: ["university", "aquaintance", "seaside"]
  },
  {
    title: "Halloween 2024",
    location: "UC - Sanciangko, Cebu",
    icon: uc,
    date: "5",
    month: "FEB",
    tags: ["university", "halloween", "seaside"]
  }
]

const recentThreadData = [
  {
    title: "Selling a Business and Scaling", 
    author: "Micheal Hanson", 
    icon: csps
  },
  { title: "Mental health as a founder", 
    author: "James McKeown", 
    icon: csps 
  },
  { title: "Growing to 88.5k MRR in 1 year", 
    author: "Mahfuzul Nabil", 
    icon: csps },
  { title: "Mental Health and Bootstrapping", 
    author: "Dr. J.Abedi", 
    icon: csps },
  { title: "Money, Happiness, and Productivity", 
    author: "Jesse Hanley", 
    icon: csps 
  }
]

export const RightSidebar = () => {
  return (
    <SidebarLayout
      className="flex-col gap-6 rg:flex"
      width={250}
      position="right-6"
    >
      <div 
        className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 shadow-slate-400 shadow-md dark:shadow-gray-900"
        id="sidebar"
      > 
        <Link to="">
          <div className="flex items-center mb-4">        
            <h1>Upcoming Events</h1>
            <img src={arrowbutton} alt="" className="h-6"/>
          </div>
        </Link>
        
        {upcomingEventsData.map((event, index) => {
          return (
            <UpcomingEvent key={index} {...event}/>
          );
        })}
      </div>

      <div 
        className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 shadow-slate-400 shadow-lg dark:shadow-gray-900"
        id="sidebar"
      >
        <Link to="">
          <div className="flex items-center mb-4">        
            <h1>Recent Threads</h1>
            <img src={arrowbutton} alt="" className="h-6"/>
          </div>
        </Link>

        {recentThreadData.map((event, index) => {
          return (
            <RecentThread key={index} iconBgcolor="#EFF5F8" {...event}/>
          );
        })}
      </div>
    </SidebarLayout>
  );
};

interface UpcomingEventProps {
  title: string;
  icon: string;
  location: string;
  date: string;
  month: string;
  tags: string[];
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
};

const UpcomingEvent = ({ title, location, icon, date, month, tags }: UpcomingEventProps) => {
  return (
    <Link to="">
      <div className="flex gap-4 mb-4">
        <div className="bg-container flex flex-col flex-items-center justify-center rounded-lg w-12 h-12 text-center">
          <p className="text-xs"> {month} </p>
          <p className="text-lg text-blue-400"> {date} </p>
        </div>

        <div className="flex-1">
          <div className="flex flex-items-center gap-2 mb-1">
            <p className="text-sm"> {truncateText(title, 23)} </p>
          </div>
          <div className="flex flex-items-center gap-2">
            <img src={icon} alt="" className="h-5 w-5 rounded-full" />
            <p className="text-xs text-muted-foreground mb-2">{truncateText(location, 22)}</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <p
                className="bg-container text-muted-foreground text-xs px-2 py-0.5 rounded-full"
                key={index}    
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

interface RecentThreadProps {
  title: string;
  author: string;
  icon: string;
  iconBgcolor: string;
}

const RecentThread = ({ title, author, icon, iconBgcolor}: RecentThreadProps) => {
  return (
    <div className="flex flex-items-start gap-2">
      <div 
        className={`rounded-xl h-10 w-10 flex items-center justify-center`}
        style={{ backgroundColor: iconBgcolor }}
      >
        <img src={icon} alt="" className="h-5 w-5" />
      </div>
      

      <div className="flex-1">
          <p className="text-sm">{truncateText(title, 23)}</p>
          <p className="text-xs text-muted-foreground">
            by {truncateText(author, 22)}
          </p>
      </div>

      <Link to="">
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