import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService";

const getCardById = async (id) => {
  const response = await CardSearchApiService.searchCardById(id);
  const card = response.status === 200 ? response.data : {};
  return card;
};

export default function useCardById(id) {
  return useSWR([`cards/${id}`, id], ([url, id]) => id ? getCardById(id) : {});
}