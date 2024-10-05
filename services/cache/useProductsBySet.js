import useSWR from "swr";
import ProductsApiService from "../apis/productsApiService"

const getProductsBySet = async (set) => {
  const response = await ProductsApiService.getProductsBySet(set);
  const productList = response.status === 200 ? response.data : [];
  return productList
}

export default function useProductsBySet(set) {
  return useSWR([`products/set/${set}`, set], ([url, set]) => set ? getProductsBySet(set) : []);
}