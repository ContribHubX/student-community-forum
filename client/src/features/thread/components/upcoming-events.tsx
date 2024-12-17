import { Link } from "react-router-dom";

import upcomingEventsData from "@/features/shared/data/upcoming-events-data";

import { useGetEvents } from "@/features/event/api/get-events";
import { CommunityEvent } from "@/types";
import { Calendar } from "lucide-react";

export interface UpcomingEventsListProp {
  communityId?: string
}

export const UpcomingEventsList = ({ communityId }: UpcomingEventsListProp) => {
  const { data: upcomingEvents } = useGetEvents({ communityId: communityId || "" });
    
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

      {upcomingEvents && upcomingEvents.length ? (
        upcomingEvents?.map((event) => (
          <UpcomingEvent 
            key={event.id}  
            event={event}
          />
        ))
      ) : (
        upcomingEventsData.map((event) => (
          <UpcomingEvent 
            key={event.id}  
            event={event}
          />
        ))
      )}

    </div>
  );
};


interface UpcomingEventProps {
  event: CommunityEvent
}

// const defaultIcon = 'https://via.placeholder.com/150'; 
const defaultLocation = 'Online';

const UpcomingEvent = ({ event }: UpcomingEventProps) => {
  const { name, eventDate, tags, } = event;

  const dateObj = new Date(eventDate);
  const month = dateObj.toLocaleString('default', { month: 'short' }); 
  const date = dateObj.getDate(); 

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <Link to="">
      <div className="flex gap-4 mb-4">
        {/* Date Box */}
        <div className="bg-container flex flex-col items-center w-12 justify-center rounded-lg text-center">
          <p className="text-xs">{month}</p>
          <p className="text-lg text-blue-400">{date}</p>
        </div>

        {/* Event Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm">{truncateText(name, 23)}</p>
          </div>
          <div className="flex items-center gap-2">
             {/* Default Event Icon */}
             <div className="h-5 w-5 flex items-center justify-center rounded-full bg-background border-none">
              <Calendar className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {truncateText(defaultLocation, 22)}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <p
                className="bg-container text-muted-foreground text-xs px-2 py-0.5 rounded-full"
                key={index}
              >
                {tag.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};