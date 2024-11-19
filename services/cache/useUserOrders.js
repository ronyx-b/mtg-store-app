import useSWR from "swr";
import UsersApiService from "../apis/usersApiService";

/**
 * @typedef {import("@/types").Order} Order
 * @typedef {import("@/types").Pagination} Pagination
 * @typedef {import("@/types").PaginatedResult} PaginatedResult
 * @typedef {PaginatedResult & {orders: Order[]}} PaginatedOrders
 */

const getUserOrders = async (token, pagination) => {
  const response = await UsersApiService.getUserOrders(token, pagination);
  const orders = response.status === 200 ? response.data : null;
  return orders;
};

/**
 * Hook that gets and caches a user's orders
 * @param {string} token 
 * @param {Pagination} pagination 
 * @returns {import("swr").SWRResponse<PaginatedOrders, Error>}
 */
export default function useUserOrders(token, pagination = { pageNum: 1, pageSize: 10 }) {
  return useSWR(
    ["user/orders/", token, pagination], 
    ([url, token, pagination]) => token ? getUserOrders(token, pagination) : null
  );
}