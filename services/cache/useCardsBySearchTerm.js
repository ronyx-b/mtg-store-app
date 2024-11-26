import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService"

/** @typedef {import("@/scryfall-api-types").Card} Card */

/**
 * @async
 * @param {string} set
 * @returns {Promise<Card[]>} 
 */
const getCardsBySearchTerm = async (query) => {
  /** @type {Card[]} */
  let cardData = [];

  let response = await CardSearchApiService.searchCardByTerm(query);
  cardData.push(...response.data?.data);
  
  while (response.data?.has_more) {
    response = await CardSearchApiService.searchCardMorePages(response.data.next_page);
    cardData.push(...response.data?.data);
  } 
  
  return cardData;
}

/**
 * Gets and caches a list of cards by a search query
 * @param {string} query 
 * @returns {import("swr").SWRResponse<Card[], Error, any>}
 */
export default function useCardsBySearchTerm(query) {
  return useSWR([`cards?query=${query}`, query], ([url, query]) => query ? getCardsBySearchTerm(query) : [])
}