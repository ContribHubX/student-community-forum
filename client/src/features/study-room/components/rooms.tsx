import { RoomCard } from "./room-card";
import { useGetStudyRooms } from "../api/get-rooms";

export const Rooms = () => {
  const { data: rooms } = useGetStudyRooms({});

  return (
    <div className="flex items-center gap-4  w-screen overflow-x-auto">
      {rooms?.map((room) => <RoomCard key={room.id} room={room} />)}
    </div>
  );
};
