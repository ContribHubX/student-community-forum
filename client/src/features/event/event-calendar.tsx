import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isToday,
  startOfMonth,
} from "date-fns";
import { FaPlus } from "react-icons/fa6";

// temporary type
type Event = {
  date: Date;
  title: string;
};

interface EventsCalendarProps {
  events: Event[];
}

export const EventCalendar = ({ events }: EventsCalendarProps) => {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);
  return (
    <div className="h-full flex flex-col gap-5 ">
      <div className="flex justify-center items-center relative">
        <p className="text-lg font-bold">{format(currentDate, "MMMM yyyy")}</p>

        <div
          className="absolute cursor-pointer h-8 w-8 right-0 rounded-full bg-accent grid 
        place-content-center text-accent-foreground"
        >
          <FaPlus />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-7 gap-2 mb-9">
        {daysOfWeek.map((day) => (
          <div className="grid place-content-center font-medium">{day}</div>
        ))}

        {Array.from({ length: startingDayIndex }).map((_, index) => {
          return <div key={index} />;
        })}

        {daysInMonth.map((day, index) => (
          <div
            key={index}
            className={`p-2 flex rounded-xl font-light items-center justify-center relative h-20
                cursor-pointer shadow-slate-400 shadow-md dark:shadow-gray-900
                text-primary-foreground ${isToday(day) ? "bg-accent text-white" : "bg-primary"}`}
          >
            <p className="absolute right-2 top-2">{format(day, "d")}</p>
            {isToday(day) && <p className="">Today</p>}

            {events
              .filter((event) => isSameDay(event.date, day))
              .map((event) => {
                return (
                  <div
                    key={event.title}
                    className="text-accent text-lg font-bold"
                  >
                    {event.title}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};
