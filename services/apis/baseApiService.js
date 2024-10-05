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
   * GET request
   * @param {string} url 
   * @param {import("axios").AxiosRequestConfig} config 
   * @returns 
   */
  static async get(url, config) {
    return this.axiosInstance.get(url, config);
  }

  /**
   * POST request
   * @param {string} url 
   * @param {Object} data 
   * @param {import("axios").AxiosRequestConfig} config 
   * @returns 
   */
  static async post(url, data, config) {
    return this.axiosInstance.post(url, data, config);
  }

  /**
   * PUT request
   * @param {string} url 
   * @param {Object} data 
   * @param {import("axios").AxiosRequestConfig} config 
   * @returns 
   */
  static async put(url, data, config) {
    return this.axiosInstance.put(url, data, config)
  }

  /**
   * DELETE request
   * @param {string} url 
   * @param {import("axios").AxiosRequestConfig} config 
   * @returns 
   */
  static async delete(url, config) {
    return this.axiosInstance.delete(url, config);
  }
}

export default BaseApiService;