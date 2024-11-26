import useSWR from "swr";
import UsersApiService from "../apis/usersApiService"

/** @typedef {import("@/types").User} User */

const getUserData = async (token) => {
  const response = await UsersApiService.getUserData(token);
  const user = response.status === 200 ? response.data?.user : null;
  return user;
}

/**
 * Hook that gets and caches a user's profile
 * @param {string} token 
 * @returns {import("swr").SWRResponse<User, Error, any>}
 */
export default function useUserProfile(token) {
  return useSWR(["user/", token], ([url, token]) => token ? getUserData(token) : null);
}