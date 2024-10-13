import BaseApiService from "./baseApiService";

class UsersApiService extends BaseApiService {
  /**
   * Registers a new user
   * @async
   * @param {Object} body 
   * @returns 
   */
  static async registerUser(body) {
    const url = `/api/user/register`;
    return this.post(url, body);
  }

  /**
   * Logs in a user
   * @async
   * @param {Object} body 
   * @returns 
   */
  static async loginUser(body) {
    const url = `/api/user/login`;
    return this.post(url, body);
  }

  static async isAdmin(token) {
    const url =`/api/user/is-admin`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    }
    return this.post(url, {}, config);
  }
}

export default UsersApiService;