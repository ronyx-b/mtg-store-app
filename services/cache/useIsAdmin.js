import useSWR from "swr";
import UsersApiService from "../apis/usersApiService";

/** @param {string} token */
const getIsAdmin = async (token) => {
  let isAdmin = false;
  try {
    const response = await UsersApiService.isAdmin(token);
    isAdmin = !!response?.data?.isAdmin;
  }
  catch (err) {
    console.log(err);
  }
  return isAdmin;
}

/** @param {string} token */
export default function useIsAdmin(token) {
  return useSWR(["user/is-admin", token], ([url, token]) => token ? getIsAdmin(token) : false)
}