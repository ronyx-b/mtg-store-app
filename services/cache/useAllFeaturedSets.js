import useSWR from "swr";
import SetsApiService from "../apis/setsApiService";

/** @typedef {import("@/types").Pagination} Pagination */
/** @typedef {import("@/types").FeaturedSet} FeaturedSet */

/** @param {Pagination} pagination */
const getAllSets = async (pagination = { pageSize: 10, pageNum: 1 }) => {
  const response = await SetsApiService.getAllSets(pagination);
  const setList = response.status === 200 ? response.data?.featuredSetList : [];
  return setList;
}

/**
 * Gets and caches a list of all featured sets
 * @async
 * @param {Pagination} pagination 
 * @returns {import("swr").SWRResponse<FeaturedSet[], Error, any>}
 */
export default function useAllFeaturedSets(pagination = { pageSize: 10, pageNum: 1 }) {
  return useSWR(
    [`sets?pageSize=${pagination?.pageSize}&pageNum=${pagination?.pageNum}`, pagination], 
    (url, pagination) => getAllSets(pagination)
  );
}