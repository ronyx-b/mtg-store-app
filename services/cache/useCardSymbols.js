import useSWR from "swr";
import CardSearchApiService from "../apis/cardSearchApiService";

const getCardSymbols = async () => {
  const response = await CardSearchApiService.getCardSymbols();
  const symbols = response.status === 200 ? response.data.data : [];
  return symbols;
};

export default function useCardSymbols() {
  return useSWR("symbols", getCardSymbols);
}