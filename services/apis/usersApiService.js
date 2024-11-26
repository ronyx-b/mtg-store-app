import BaseApiService from "./baseApiService";

/** @typedef {import("@/types").BaseDataProcessingResponse} BaseDataProcessingResponse */
/** @typedef {import("@/types").LoginResponse} LoginResponse */
/** @typedef {import("@/types").User} User */
/** @typedef {import("@/types").ChangePasswordRequestBody} ChangePasswordRequestBody */
/** @typedef {import("@/types").Address} Address */
/** @typedef {import("@/types").ManageAddressResponse} ManageAddressResponse */
/** @typedef {import("@/types").Pagination} Pagination */
/** @typedef {import("@/types").Order} Order */
/** @typedef {import("@/types").OrderItem} OrderItem */

class UsersApiService extends BaseApiService {
  /**
   * Registers a new user
   * @async
   * @param {Object} body 
   * @returns {Promise<import("axios").AxiosResponse<BaseDataProcessingResponse>>}
   */
  static async registerUser(body) {
    const url = `/api/user/register`;
    return this.post(url, body);
  }

  /**
   * Logs in a user
   * @async
   * @param {Types.LoginRequest} body 
   * @returns {Promise<import("axios").AxiosResponse<LoginResponse>>}
   */
  static async loginUser(body) {
    const url = `/api/user/login`;
    return this.post(url, body);
  }

  /**
   * Gets a user profile info
   * @async
   * @param {string} token 
   * @returns {Promise<import("axios").AxiosResponse<{ user: User }>>}
   */
  static async getUserData(token) {
    const url =`/api/user`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    };
    return this.get(url, config);
  }

  /**
   * Confirms if a user is admin
   * @async
   * @param {string} token 
   * @returns {Promise<import("axios").AxiosResponse<{ isAdmin: boolean }>>}
   */
  static async isAdmin(token) {
    const url =`/api/user/is-admin`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    };
    return this.get(url, config);
  }

  /**
   * Change a user's password
   * @async
   * @param {string} token 
   * @param {ChangePasswordRequestBody} data 
   * @returns {Promise<import("axios").AxiosResponse<BaseDataProcessingResponse>>}
   */
  static async changePassword(token, data) {
    const url = `/api/user/password`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    };
    return this.put(url, data, config);
  }

  /**
   * Add an address to the user
   * @async
   * @param {string} token 
   * @param {Address} data 
   * @returns {Promise<import("axios").AxiosResponse<ManageAddressResponse, Address>>}
   */
  static async addAddress(token, data) {
    const url = `api/user/address`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    };
    return this.post(url, data, config);
  }

  /**
   * Edit an address from the user
   * @async
   * @param {string} token 
   * @param {Address} data 
   * @returns {Promise<import("axios").AxiosResponse<ManageAddressResponse, Address>>}
   */
  static async editAddress(token, data) {
    const url = `api/user/address`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    };
    return this.put(url, data, config);
  }

  /**
   * Deletes an address from the user
   * @async
   * @param {string} token 
   * @param {{ addressId: string }} data 
   * @returns {Promise<import("axios").AxiosResponse<BaseDataProcessingResponse>>}
   */
  static async deleteAddress(token, data) {
    const url = `api/user/address/${data.addressId}`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    };
    return this.delete(url, config);
  }

  /**
   * Updates the default address
   * @async
   * @param {string} token 
   * @param {{ addressId: string }} data 
   * @returns {Promise<import("axios").AxiosResponse<BaseDataProcessingResponse>>}
   */
  static async updateDefaultAddress(token, data) {
    const url = `api/user/address/default`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    };
    return this.put(url, data, config);
  }

  /**
   * Gets a user orders
   * @async
   * @param {string} token 
   * @param {Pagination} pagination 
   * @returns {Promise<import("axios").AxiosResponse<{ orders: Order[] }>>}
   */
  static async getUserOrders(token, pagination = { pageNum: 1, pageSize: 10 }) {
    const url =`/api/user/orders?pageSize=${pagination.pageSize}&pageNum=${pagination.pageNum}`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    };
    return this.get(url, config);
  }

  /**
   * Checks out a user's order
   * @async
   * @param {{ date: Date, address: Address, products: OrderItem[] }} orderData 
   * @param {string} token 
   * @returns {Promise<import("axios").AxiosResponse<Types.BaseDataProcessingResponse>>}
   */
  static async checkoutOrder(orderData, token) {
    const url =`/api/user/orders`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    };
    return this.post(url, orderData, config);
  }

  /**
   * Gets an order by its ID
   * @param {string} orderId 
   * @param {string} token 
   * @returns {Promise<import("axios").AxiosResponse<{ order: Order }>>}
   */
  static async getOrderDetails(orderId, token) {
    const url =`/api/user/orders/${orderId}`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: {
        'Authorization': `JWT ${token}`
      }
    };
    return this.get(url, config);
  }
}

export default UsersApiService;