import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService";

const getAllCardSets = async () => {
  const response = await CardSearchApiService.getAllCardSets();
  const sets = [...response.data.data].filter((set) => set.set_type !== "alchemy" && set.set_type !== "promo" && set.set_type !== "token" && set.set_type !== "memorabilia")
  return sets;
}

export default function useAllCardSets() {
  return useSWR("api.scryfall.com/sets", getAllCardSets);
}