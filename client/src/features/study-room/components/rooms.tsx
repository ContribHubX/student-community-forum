import { RoomCard } from "./room-card";
import { useGetStudyRooms } from "../api/get-rooms";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const Rooms = () => {
  const { data: rooms } = useGetStudyRooms({});

  return (
    <ScrollArea 
      className="pb-4 whitespace-nowrap"
    >
      <div
        className="w-screen flex items-center gap-4"
      >
        {rooms?.map((room) => <RoomCard key={room.id} room={room} />)}
      </div>
      <ScrollBar 
        orientation="horizontal" 
      />
    </ScrollArea>
  );
};
