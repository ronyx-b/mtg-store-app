import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService"

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

export default function useCardsBySearchTerm(query) {
  return useSWR([`cards?query=${query}`, query], ([url, query]) => query ? getCardsBySearchTerm(query) : [])
}