
import { GetMe } from "@repo/shared/dist/interfaces/auth";
import useSWR from "swr";
import { api } from "@/lib/api";
export const useMe = () => {
  const { data, ...rest } = useSWR('/auth/me', url => api.get<GetMe.Response>(url).then(res => res.data));

  if (!data) {
    return {
      isAuthenticated: false,
      username: '',
      id: null,
      ...rest
    };
  }

  return {
    isAuthenticated: data.isAuthenticated,
    username: data?.user?.username || '',
    id: data?.user?.id || '',
    ...rest
  };
};
