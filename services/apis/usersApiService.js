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

  /**
   * Gets a user profile info
   * @async
   * @param {string} token 
   * @returns 
   */
  static async getUserData(token) {
    const url =`/api/user`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    }
    return this.get(url, config);
  }

  /**
   * Confirms if a user is admin
   * @async
   * @param {string} token 
   * @returns 
   */
  static async isAdmin(token) {
    const url =`/api/user/is-admin`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    }
    return this.get(url, config);
  }

  /**
   * Gets a user orders
   * @async
   * @param {string} token 
   * @returns 
   */
  static async getUserOrders(token) {
    const url =`/api/user/orders`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    }
    return this.get(url, config);
  }

  static async checkoutOrder(orderData, token) {

  }

  static async getOrderDetails(orderId, token) {

  }
}

export default UsersApiService;