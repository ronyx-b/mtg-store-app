import useSWR from "swr";
import ProductsApiService from "../apis/productsApiService"

const getAllProducts = async (pagination = { pageSize: 10, pageNum: 1 }) => {
  const response = await ProductsApiService.getAllProducts(pagination)
  const productList = response.status === 200 ? response.data : [];
  return productList;
}

export default function useAllProducts(pagination = { pageSize: 10, pageNum: 1 }) {
  return useSWR(
    [`products?pageSize=${pagination.pageSize}&pageNum=${pagination.pageNum}`, pagination],
    ([url, pagination]) => getAllProducts(pagination)
  );
}