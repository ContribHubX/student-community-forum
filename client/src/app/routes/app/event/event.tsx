import { Navbar } from "@/components/shared/navbar";
import { EventCalendar } from "@/features/event/event-calendar";

import { events } from "@/features/event/data/events";

export const EventRoute = () => {
  return (
    <div className="bg-background flex flex-col pt-[5rem] text-primary-foreground pb-6">
      <Navbar></Navbar>
      <div className="flex-1 w-[90%] mx-auto pt-5 gap-2">
        <EventCalendar events={events} />
      </div>
    </div>
  );
};