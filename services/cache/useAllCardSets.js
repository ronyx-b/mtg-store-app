import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService";

/** @typedef {import("@/scryfall-api-types").SetType} SetType */

const getAllCardSets = async () => {
  /** @type {SetType[]} */
  const filterSets = ["alchemy", "promo", "token", "memorabilia", "vanguard"];
  const response = await CardSearchApiService.getAllCardSets();
  const sets = [...response.data?.data].filter((set) => !filterSets.includes(set.set_type))
  return sets;
}

export default function useAllCardSets() {
  return useSWR("api.scryfall.com/sets", getAllCardSets);
}