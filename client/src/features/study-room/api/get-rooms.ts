import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { StudyRoom } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getStudyRooms = async (): Promise<StudyRoom[]> => {
  const response = await api.get(`/api/study-room`);
  return response.data;
};

export const getStudyRoomsQueryOptions = () => {
  return queryOptions({
    queryKey: ["study-rooms"],
    queryFn: () => getStudyRooms(),
  });
};

export type getStudyRoomsQueryConfig = {
  queryConfig?: QueryConfig<typeof getStudyRooms>;
};

export const useGetStudyRooms = ({ queryConfig }: getStudyRoomsQueryConfig) => {
  return useQuery({
    ...getStudyRoomsQueryOptions(),
    ...queryConfig,
  });
};
