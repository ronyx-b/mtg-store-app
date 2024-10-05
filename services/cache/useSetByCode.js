import useSWR from "swr";
import SetsApiService from "../apis/setsApiService";

const getSetByCode = async (code) => {
  const response = await SetsApiService.getSetByCode(code);
  const setData = response.status === 200 ? response.data : {};
  return setData
}

export default function useSetByCode(code) {
  return useSWR([`sets/${code}`, code], ([url, code]) => code ? getSetByCode(code) : null);
}