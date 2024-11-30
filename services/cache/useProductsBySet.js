import useSWR from "swr";
import ProductsApiService from "../apis/productsApiService"

/** @typedef {import("@/types").Pagination} Pagination */
/** @typedef {import("@/types").ProductListResponse} ProductListResponse */

/**
 * @param {string} set
 * @param {Pagination} [pagination]
 * @returns {ProductListResponse}
 */
const getProductsBySet = async (set, pagination) => {
  const response = await ProductsApiService.getProductsBySet(set, pagination);
  const products = response.status === 200 ? response.data : null;
  return products
}

/**
 * Hook that gets and caches a list of products from a given set
 * @param {string} set
 * @param {Pagination} [pagination]
 * @returns {import("swr").SWRResponse<ProductListResponse, Error, any>}
 */
export default function useProductsBySet(set, pagination) {
  return useSWR([`products/set/${set}`, set], ([url, set]) => set ? getProductsBySet(set, pagination) : null);
}