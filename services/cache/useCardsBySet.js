import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService"

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

export default function useCardsBySet(set) {
  return useSWR([`cards?set=${set}`, set], ([url, set]) => set ? getCardsBySet(set) : [])
}