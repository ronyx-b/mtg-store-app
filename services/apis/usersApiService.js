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
   * @param {{ pageSize: number|string, pageNum: number|string }} pagination 
   * @returns 
   */
  static async getUserOrders(token, pagination = { pageNum: 1, pageSize: 10 }) {
    const url =`/api/user/orders?pageSize=${pagination.pageSize}&pageNum=${pagination.pageNum}`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    }
    return this.get(url, config);
  }

  /**
   * Checks out a user's order
   * @async
   * @param {{ date: Date, address: Object, products: Object[] }} orderData 
   * @param {string} token 
   * @returns 
   */
  static async checkoutOrder(orderData, token) {
    const url =`/api/user/orders`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    }
    return this.post(url, orderData, config);
  }

  /**
   * Gets an order by its ID
   * @param {string} orderId 
   * @param {string} token 
   * @returns 
   */
  static async getOrderDetails(orderId, token) {
    const url =`/api/user/orders/${orderId}`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    }
    return this.get(url, config);
  }
}

export default UsersApiService;