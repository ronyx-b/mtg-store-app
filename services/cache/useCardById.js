import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService";

/** @typedef {import("@/types").Card} Card */

const getCardById = async (id) => {
  const response = await CardSearchApiService.searchCardById(id);
  const card = response.status === 200 ? response.data : null;
  return card;
};

/**
 * Gets and caches a card by its ID
 * @param {string} id 
 * @returns {import("swr").SWRResponse<Card, Error, any>}
 */
export default function useCardById(id) {
  return useSWR([`cards/${id}`, id], ([url, id]) => id ? getCardById(id) : null);
}