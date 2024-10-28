import useSWR from "swr";
import UsersApiService from "../apis/usersApiService";

const getUserOrders = async (token) => {
  const response = await UsersApiService.getUserOrders(token);
  const orders = response.status === 200 ? response.data.orders : [];
  return orders;
};

export default function useUserOrders(token) {
  return useSWR(["user/orders/", token], ([url, token]) => token ? getUserOrders(token) : []);
}