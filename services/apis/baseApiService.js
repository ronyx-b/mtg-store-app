import { SERVER_URL } from "@/config";
import axios from "axios";

const apiBaseUrl = SERVER_URL || "/";

/** @type {import("axios").CreateAxiosDefaults} */
const axiosInstanceConfigs = {
  baseURL: apiBaseUrl,
  headers: {
    common: {
      "Accept": "application/json",
    }
  }
};

class BaseApiService {
  /** @type {import("axios").AxiosInstance} */
  static axiosInstance = axios.create(axiosInstanceConfigs);

    /**
   * 
   * @param {"get" | "post" | "put" | "delete" | "patch" | "head" | "options"} method 
   * @param {string} url 
   * @param {Object} [data] 
   * @param {import("axios").AxiosRequestConfig} [customConfig]
   * @returns
   */
    static async requestProcessor(method = "get", url, data, customConfig) {
      /** @type {import("axios").AxiosResponse} */
      let response;
      try {
        response = await this.axiosInstance.request({ method, url, data, ...customConfig })
      }
      catch (/** @type {import("axios").AxiosError<any, any>} */ error) {
        if (error.response) {
          response = error.response;
        }
      }
      return response;
    }

  /**
   * GET request
   * @param {string} url 
   * @param {import("axios").AxiosRequestConfig} config 
   * @returns 
   */
  static async get(url, config) {
    return this.requestProcessor("get", url, null, config);
  }

  /**
   * POST request
   * @param {string} url 
   * @param {Object} data 
   * @param {import("axios").AxiosRequestConfig} config 
   * @returns 
   */
  static async post(url, data, config) {
    return this.requestProcessor("post", url, data, config);
  }

  /**
   * PUT request
   * @param {string} url 
   * @param {Object} data 
   * @param {import("axios").AxiosRequestConfig} config 
   * @returns 
   */
  static async put(url, data, config) {
    return this.requestProcessor("put", url, data, config)
  }

  /**
   * DELETE request
   * @param {string} url 
   * @param {import("axios").AxiosRequestConfig} config 
   * @returns 
   */
  static async delete(url, config) {
    return this.requestProcessor("delete", url, null, config);
  }
}

export default BaseApiService;