import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService"

/** @typedef {import("@/scryfall-api-types").Card} Card */

/**
 * @async
 * @param {string} set
 * @returns {Promise<Card[]>} 
 */
const getCardsBySet = async (set) => {
  /** @type {Card[]} */
  let cardData = [];

  let response = await CardSearchApiService.searchCardBySet(set);
  cardData.push(...response.data?.data);

  while (response.data?.has_more) {
    response = await CardSearchApiService.searchCardMorePages(response.data.next_page);
    cardData.push(...response.data?.data);
  } 
  
  return cardData;
}

/**
 * Gets and caches a list of cards from a set
 * @param {string} set 
 * @returns {import("swr").SWRResponse<Card[], Error, any>}
 */
export default function useCardsBySet(set) {
  return useSWR([`cards?set=${set}`, set], ([url, set]) => set ? getCardsBySet(set) : [])
}