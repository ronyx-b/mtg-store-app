import useSWR from "swr";
import ProductsApiService from "../apis/productsApiService";

const getProductsFromCollection = async (data) => {
  const response = await ProductsApiService.getProductsFromCollection(data);
  const products = response.status === 200 ? response.data.products : [];
  return products;
};

/**
 * Cache service that gets a list of products given a list of its ids
 * @async
 * @param {{ productIdList: string[] }} data
 * @returns 
 */
export default function useProductsFromCollection(data) {
  return useSWR(
    ["products/collection", data],
    ([url, data]) => data?.productIdList?.length > 0 ? getProductsFromCollection(data) : []
  );
}