import { upcomingEventsData } from "@/features/shared/data/upcoming-events-data";
import { truncateText } from "@/utils";
import { Link } from "react-router-dom";

export const UpcomingEventsList = () => {
  return (
    <div
      className="bg-primary text-primary-foreground rounded-2xl flex flex-col p-4 gap-4 shadow-slate-400 shadow-md dark:shadow-gray-900"
      id="sidebar"
    >
      <Link to="">
        <div className="flex items-center mb-1">
          <h1 className="text-sm font-medium">Upcoming Events</h1>
        </div>
      </Link>

      {upcomingEventsData.map((event, index) => {
        return <UpcomingEvent key={index} {...event} />;
      })}
    </div>
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

const UpcomingEvent = ({
  title,
  location,
  icon,
  date,
  month,
  tags,
}: UpcomingEventProps) => {
  return (
    <Link to="">
      <div className="flex gap-4 mb-4 ">
        <div className="bg-container flex flex-col flex-items-center w-12 justify-center rounded-lg  text-center">
          <p className="text-xs"> {month} </p>
          <p className="text-lg text-blue-400"> {date} </p>
        </div>

        <div className="flex-1">
          <div className="flex flex-items-center gap-2 mb-1">
            <p className="text-sm"> {truncateText(title, 23)} </p>
          </div>
          <div className="flex flex-items-center gap-2">
            <img src={icon} alt="" className="h-5 w-5 rounded-full" />
            <p className="text-xs text-muted-foreground mb-2">
              {truncateText(location, 22)}
            </p>
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
