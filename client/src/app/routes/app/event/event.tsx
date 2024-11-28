import { Navbar } from "@/components/shared/navbar";
import { EventCalendar } from "@/features/event/event-calendar";
import { subDays } from "date-fns";

export const Event = () => {
  return (
    <div className="bg-background h-screen w-screen flex flex-col pt-[5rem] text-primary-foreground">
      <Navbar></Navbar>
      <div className="flex-1 w-[90%] mx-auto pt-5 gap-2">
        <EventCalendar
          events={[
            { date: subDays(new Date(), 6), title: "UC Intrams" },
            { date: subDays(new Date(), 15), title: "Uc Days" },
          ]}
        />
      </div>
    </div>
  );
};
