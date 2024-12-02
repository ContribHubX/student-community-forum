import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { StudyRoom } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getStudyRoom = async (roomId: string): Promise<StudyRoom> => {
  const response = await api.get(`/api/study-room/${roomId}`);
  return response.data;
};

export const getStudyRoomQueryOptions = (roomId: string) => {
  return queryOptions({
    queryKey: ["study-room", roomId],
    queryFn: () => getStudyRoom(roomId),
  });
};

export type getStudyRoomQueryConfig = {
  roomId: string,
  queryConfig?: QueryConfig<typeof getStudyRoom>;
};

export const useGetStudyRoom = ({ roomId, queryConfig }: getStudyRoomQueryConfig) => {
  return useQuery({
    ...getStudyRoomQueryOptions(roomId),
    ...queryConfig,
  });
};
