import useSWR from "swr";
import UsersApiService from "../apis/usersApiService"

const getUserData = async (token) => {
  const response = await UsersApiService.getUserData(token);
  const user = response.status === 200 ? response.data?.user : null;
  return user;
}

export default function useUserProfile(token) {
  return useSWR(["user/", token], ([url, token]) => token ? getUserData(token) : null);
}