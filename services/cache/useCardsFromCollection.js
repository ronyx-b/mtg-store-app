import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService";

/** @typedef {import("@/scryfall-api-types").Card} Card */
/** @typedef {import("@/scryfall-api-types").CardIdentifiers} CardIdentifiers */

/**
 * @async
 * @param {{ identifiers: CardIdentifiers[] }} data 
 * @returns {Promise<Card[]>}
 */
const getCardsFromCollection = async (data) => {
  const response = await CardSearchApiService.getCardsFromCollection(data);
  const cards = response.status === 200 ? response.data.data : [];
  return cards;
};

/**
 * Cache service that gets a list of cards given a list of its ids
 * @param {{ identifiers: CardIdentifiers[] }} data 
 * @returns {import("swr").SWRResponse<Card[], Error, any>}
 */
export default function useCardsFromCollection(data) {
  return useSWR(
    ["cards/collection", data], 
    ([url, data]) => data?.identifiers?.length > 0 ? getCardsFromCollection(data) : [] 
  );
}