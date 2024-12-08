import { CommunityEvent } from "@/types";
import { setMonth, addDays } from "date-fns";

export const events: CommunityEvent[] = [
    {
      id: "1",
      name: "December Kickoff",
      eventDate: setMonth(new Date(), 11), 
      tags: ["celebration", "winter"],
      communityId: "123"
    },
    {
      id: "2",
      name: "Holiday Workshop",
      eventDate: setMonth(addDays(new Date(), 3), 11),
      tags: ["education", "community"],
       communityId: "123"
    },
    {
      id: "3",
      name: "Winter Gala",
      eventDate: setMonth(addDays(new Date(), 10), 11),
      tags: ["celebration", "formal"],
       communityId: "123"
    },
    {
      id: "4",
      name: "Charity Drive",
      eventDate: setMonth(addDays(new Date(), 17), 11),
      tags: ["community", "charity"],
       communityId: "123"
    },
    {
      id: "5",
      name: "New Year's Eve Party",
      eventDate: setMonth(addDays(new Date(), 24), 11),
      tags: ["celebration", "new year"],
      communityId: "123"
    },
  ];
  