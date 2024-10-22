import { CARD_SEARCH_API_BASE_URL } from "@/config";
import BaseApiService from "./baseApiService";

class CardSearchApiService extends BaseApiService {
  /**
   * Gets a list of cards from the card search API by search term
   * @async
   * @param {string} query 
   * @returns 
   */
  static async searchCardByTerm(query) {
    const url = `${CARD_SEARCH_API_BASE_URL}/cards/search?q=${query}&unique=prints`;
    return this.get(url);
  }

  /**
   * Gets a list of cards from the card search API by a given set
   * @async
   * @param {string} set 
   * @returns
   */
  static async searchCardBySet(set) {
    const url = `${CARD_SEARCH_API_BASE_URL}/cards/search?order=set&q=e%3A${set}&unique=prints`;
    return this.get(url);
  }

  /**
   * Gets a list of cards in the next page of a previous search
   * @async
   * @param {string} nextPage URL search string for next page in search
   * @returns 
   */
  static async searchCardMorePages(nextPage) {
    return this.get(nextPage);
  }

  /**
   * Gets card details given its ID
   * @async
   * @param {string} id 
   * @returns 
   */
  static async searchCardById(id) {
    const url = `${CARD_SEARCH_API_BASE_URL}/cards/${id}`;
    return this.get(url)
  }

  /**
   * Gets the symbols info for cards
   * @async
   * @returns 
   */
  static async getCardSymbols() {
    const url = `${CARD_SEARCH_API_BASE_URL}/symbology`;
    return this.get(url)
  }

  /**
   * Gets a list of all sets
   * @async
   * @returns 
   */
  static async getAllCardSets() {
    const url = `${CARD_SEARCH_API_BASE_URL}/sets`;
    return this.get(url)
  }
}

export default CardSearchApiService;