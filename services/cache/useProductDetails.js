import useSWR from "swr";
import ProductsApiService from "../apis/productsApiService"

const getProductById = async (id) => {
  const response = await ProductsApiService.getProductById(id);
  const productList = response.status === 200 ? response.data : [];
  return productList
}

export default function useProductDetails(id) {
  return useSWR([`products/${id}`, id], ([url, id]) => id ? getProductById(id) : {});
}