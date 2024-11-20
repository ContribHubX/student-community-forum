import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { Topic } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getAllTopics = async (): Promise<Topic[]> => {
  const response = await api.get("/api/topic");
  return response.data;
};

export const getTopicsQueryOptions = () => {
  return queryOptions({
    queryKey: ["topics"],
    queryFn: () => getAllTopics(),
  });
};

export type getTopicsQueryConfig = {
  queryConfig?: QueryConfig<typeof getAllTopics>;
};

export const useGetTopics = ({ queryConfig }: getTopicsQueryConfig) => {
  return useQuery({
    ...getTopicsQueryOptions(),
    ...queryConfig,
  });
};
