import useSWR from "swr";
import UsersApiService from "../apis/usersApiService";

const getUserOrders = async (token, pagination) => {
  const response = await UsersApiService.getUserOrders(token, pagination);
  const orders = response.status === 200 ? response.data : null;
  return orders;
};

export default function useUserOrders(token, pagination = { pageNum: 1, pageSize: 10 }) {
  return useSWR(
    ["user/orders/", token, pagination], 
    ([url, token, pagination]) => token ? getUserOrders(token, pagination) : null
  );
}