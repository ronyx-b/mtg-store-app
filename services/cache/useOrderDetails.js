import useSWR from "swr";
import UsersApiService from "../apis/usersApiService";

const getOrderDetails = async (orderId, token) => {
  const response = await UsersApiService.getOrderDetails(orderId, token);
  const order = response.status === 200 ? response.data.order : null;
  return order;
};

export default function useOrderDetails(orderId, token) {
  return useSWR(
    [`orders/${orderId}`, orderId, token], 
    ([url, orderId, token]) => orderId && token ? getOrderDetails(orderId, token) : null 
  );
}