import useSWR from "swr";
import ProductsApiService from "../apis/productsApiService"

const getProductById = async (id) => {
  const response = await ProductsApiService.getProductById(id);
  const productDetails = response.status === 200 ? response.data : null;
  return productDetails
}

export default function useProductDetails(id) {
  return useSWR([`products/${id}`, id], ([url, id]) => id ? getProductById(id) : null);
}