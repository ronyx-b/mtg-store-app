import { CARD_SEARCH_API_BASE_URL } from "@/config";
import BaseApiService from "./baseApiService";

/**
 * @typedef {import("@/scryfall-api-types").List<T>} List
 * @template T
 */
/**
 * @typedef {import("@/scryfall-api-types").CollectionList<T>} CollectionList
 * @template T
 */
/** @typedef {import("@/scryfall-api-types").Card} Card */
/** @typedef {import("@/scryfall-api-types").CardIdentifiers} CardIdentifiers */
/** @typedef {import("@/scryfall-api-types").CardSet} CardSet */
/** @typedef {import("@/scryfall-api-types").CardSymbol} CardSymbol */

class CardSearchApiService extends BaseApiService {
  /**
   * Gets a list of cards from the card search API by search term
   * @async
   * @param {string} query 
   * @returns {Promise<import("axios").AxiosResponse<List<Card>>>}
   */
  static async searchCardByTerm(query) {
    const url = `${CARD_SEARCH_API_BASE_URL}/cards/search?q=${query}&unique=prints`;
    return this.get(url);
  }

  /**
   * Gets a list of cards from the card search API by a given set
   * @async
   * @param {string} set 
   * @returns {Promise<import("axios").AxiosResponse<List<Card>>>}
   */
  static async searchCardBySet(set) {
    const url = `${CARD_SEARCH_API_BASE_URL}/cards/search?order=set&q=e%3A${set}&unique=prints`;
    return this.get(url);
  }

  /**
   * Gets a list of cards in the next page of a previous search
   * @async
   * @param {string} nextPage URL search string for next page in search
   * @returns {Promise<import("axios").AxiosResponse<List<Card>>>}
   */
  static async searchCardMorePages(nextPage) {
    return this.get(nextPage);
  }

  /**
   * Gets a list of cards given a list of its ids 
   * @async
   * @param {{ identifiers: CardIdentifiers[] }} data 
   * @returns {Promise<import("axios").AxiosResponse<CollectionList<Card>>>}
   */
  static async getCardsFromCollection(data) {
    const url = "https://api.scryfall.com/cards/collection";
    return this.post(url, data);
  }

  /**
   * Gets card details given its ID
   * @async
   * @param {string} id 
   * @returns {Promise<import("axios").AxiosResponse<Card>>}
   */
  static async searchCardById(id) {
    const url = `${CARD_SEARCH_API_BASE_URL}/cards/${id}`;
    return this.get(url)
  }

  /**
   * Gets the symbols info for cards
   * @async
   * @returns {Promise<import("axios").AxiosResponse<List<CardSymbol>>>}
   */
  static async getCardSymbols() {
    const url = `${CARD_SEARCH_API_BASE_URL}/symbology`;
    return this.get(url)
  }

  /**
   * Gets a list of all sets
   * @async
   * @returns {Promise<import("axios").AxiosResponse<List<CardSet>>>}
   */
  static async getAllCardSets() {
    const url = `${CARD_SEARCH_API_BASE_URL}/sets`;
    return this.get(url)
  }
}

export default CardSearchApiService;