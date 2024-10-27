import useSWR from "swr";
import SetsApiService from "../apis/setsApiService";

const getAllSets = async (pagination = { pageSize: 10, pageNum: 1 }) => {
  const response = await SetsApiService.getAllSets(pagination);
  const setList = response.status === 200 ? response.data.featuredSetList : [];
  return setList;
}

export default function useAllFeaturedSets(pagination = { pageSize: 10, pageNum: 1 }) {
  return useSWR(
    [`sets?pageSize=${pagination?.pageSize}&pageNum=${pagination?.pageNum}`, pagination], 
    (url, pagination) => getAllSets(pagination)
  );
}