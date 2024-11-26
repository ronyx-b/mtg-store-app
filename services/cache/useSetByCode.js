import useSWR from "swr";
import SetsApiService from "../apis/setsApiService";

const getSetByCode = async (code) => {
  const response = await SetsApiService.getSetByCode(code);
  const setDetails = response.status === 200 ? response.data?.set : null;
  return setDetails
}

/** @param {string} code */
export default function useSetByCode(code) {
  return useSWR([`sets/${code}`, code], ([url, code]) => code ? getSetByCode(code) : null);
}