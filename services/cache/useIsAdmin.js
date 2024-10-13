import useSWR from "swr";
import UsersApiService from "../apis/usersApiService";

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

export default function useIsAdmin(token) {
  return useSWR(["user/is-admin", token], ([url, token]) => token ? getIsAdmin(token) : false)
}