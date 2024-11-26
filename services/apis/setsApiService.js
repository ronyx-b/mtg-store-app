import BaseApiService from "./baseApiService";

/** @typedef {import("@/types").Pagination} Pagination */
/** @typedef {import("@/types").FeaturedSet} FeaturedSet */
/** @typedef {import("@/types").BaseDataProcessingResponse} BaseDataProcessingResponse */

class SetsApiService extends BaseApiService {
  /**
   * Gets all featured sets
   * @param {Pagination} pagination 
   * @returns {Promise<import("axios").AxiosResponse<{ featuredSetList: FeaturedSet[] }>>}
   */
  static async getAllSets(pagination = { pageSize: 10, pageNum: 1 }) {
    const url = `/api/sets?pageSize=${pagination.pageSize}&pageNum=${pagination.pageNum}`
    return this.get(url);   
  }

  /**
   * Gets a set data by its code
   * @param {string} code 
   * @returns {Promise<import("axios").AxiosResponse<{ set: FeaturedSet }>>}
   */
  static async getSetByCode(code) {
    const url = `/api/sets/${code}`;
    return this.get(url);
  }

  /**
   * Adds a new featured set
   * @async
   * @param {FormData} data 
   * @param {string} token 
   * @returns {Promise<import("axios").AxiosResponse<BaseDataProcessingResponse & {setData: FeaturedSet}>>}
   */
  static async addFeaturedSet(data, token) {
    const url = `/api/sets`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: { 
        "Authorization": `JWT ${token}`,
        "Content-Type": "multipart/form-data"
      }
    };
    return this.post(url, data, config);
  }
}

export default SetsApiService;