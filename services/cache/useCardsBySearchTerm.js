import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService"

/**
 * @typedef {import("@/types").Card} Card
 */

const getCardsBySearchTerm = async (query) => {
  let response, cardData = [];

  response = await CardSearchApiService.searchCardByTerm(query);
  cardData = [...cardData, ...response?.data?.data];
  
  while (response?.data?.has_more) {
    response = await CardSearchApiService.searchCardMorePages(response.data.next_page);
    cardData = [...cardData, ...response?.data?.data];
  } 
  
  return cardData;
}

/**
 * Gets and caches a list of cards by a search query
 * @param {string} query 
 * @returns {import("swr").SWRResponse<Card[], Error>}
 */
export default function useCardsBySearchTerm(query) {
  return useSWR([`cards?query=${query}`, query], ([url, query]) => query ? getCardsBySearchTerm(query) : [])
}