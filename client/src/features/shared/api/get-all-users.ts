import { api } from "@/lib/axios";
import { QueryConfig } from "@/lib/react-query";
import { User } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get("/api/user");
  return response.data;
};

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: ["all-users"],
    queryFn: () => getAllUsers(),
  });
};

export type getUsersQueryConfig = {
  queryConfig?: QueryConfig<typeof getAllUsers>;
};

export const useGetUsers = ({ queryConfig }: getUsersQueryConfig) => {
  return useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};
