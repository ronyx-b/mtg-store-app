import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService"

/**
 * @typedef {import("@/types").Card} Card
 */

const getCardsBySet = async (set) => {
  let response, cardData = [];

  response = await CardSearchApiService.searchCardBySet(set);
  cardData = [...cardData, ...response?.data?.data];

  while (response?.data?.has_more) {
    response = await CardSearchApiService.searchCardMorePages(response.data.next_page);
    cardData = [...cardData, ...response?.data?.data];
  } 
  
  return cardData;
}

/**
 * Gets and caches a list of cards from a set
 * @param {string} set 
 * @returns {import("swr").SWRResponse<Card[], Error>}
 */
export default function useCardsBySet(set) {
  return useSWR([`cards?set=${set}`, set], ([url, set]) => set ? getCardsBySet(set) : [])
}