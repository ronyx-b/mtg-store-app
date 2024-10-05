import BaseApiService from "./baseApiService";

class SetsApiService extends BaseApiService {
  /**
   * Gets all featured sets
   * @param {{ pageSize: number|string, pageNum: number|string }} pagination 
   * @returns 
   */
  static async getAllSets(pagination = { pageSize: 10, pageNum: 1 }) {
    const url = `/api/sets?pageSize=${pagination.pageSize}&pageNum=${pagination.pageNum}`
    return this.get(url);   
  }

  /**
   * Gets a set data by its code
   * @param {string} code 
   * @returns 
   */
  static async getSetByCode(code) {
    const url = `/api/sets/${code}`;
    return this.get(url);
  }
}

export default SetsApiService;