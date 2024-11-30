import BaseApiService from "./baseApiService";

/** @typedef {import("@/types").Pagination} Pagination */
/** @typedef {import("@/types").PaginatedResult} PaginatedResult */
/** @typedef {import("@/types").Product} Product */
/** @typedef {import("@/types").ProductListResponse} ProductListResponse */
/** @typedef {import("@/types").BaseDataProcessingResponse} BaseDataProcessingResponse */

class ProductsApiService extends BaseApiService {

  /**
   * Gets all products
   * @async
   * @param {Pagination} pagination 
   * @returns {Promise<import("axios").AxiosResponse<ProductListResponse>>}
   */
  static async getAllProducts(pagination = { pageSize: 10, pageNum: 1 }) {
    const url = `/api/products?pageSize=${pagination.pageSize}&pageNum=${pagination.pageNum}`;
    return this.get(url);
  }

  /**
   * Gets all products from a given set
   * @async
   * @param {string} set set code
   * @param {Pagination} [pagination]
   * @returns {Promise<import("axios").AxiosResponse<ProductListResponse>>}
   */
  static async getProductsBySet(set, pagination) {
    let url = `/api/products/set/${set}`
    if (pagination) {
      url += `?pageNum=${pagination?.pageNum}&pageSize=${pagination?.pageSize}`;
    }
    return this.get(url)
  }

  /**
   * Gets a product details by its id
   * @async
   * @param {string} id 
   * @returns {Promise<import("axios").AxiosResponse<Product>>}
   */
  static async getProductById(id) {
    const url = `/api/products/${id}`;
    return this.get(url)
  }

  /**
   * Gets a list of products given a list of its ids 
   * @async
   * @param {{ productIdList: string[] }} data
   * @returns {Promise<import("axios").AxiosResponse<{ products: Product[] }>>}
   */
  static async getProductsFromCollection(data) {
    const url = `/api/products/collection`;
    return this.post(url, data);
  }

  /**
   * Adds a new product
   * @async
   * @param {FormData} formData 
   * @param {string} token 
   * @returns {Promise<import("axios").AxiosResponse<BaseDataProcessingResponse>>}
   */
  static async addNewProduct(formData, token) {
    const url = `/api/products`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: { 
        "Authorization": `JWT ${token}`,
        "Content-Type": "multipart/form-data"
      }
    };
    return this.post(url, formData, config);
  }

  /**
   * Edits a product given its id
   * @param {string} id 
   * @param {FormData} formData 
   * @param {string} token 
   * @returns {Promise<import("axios").AxiosResponse<BaseDataProcessingResponse>>}
   */
  static async editProduct(id, formData, token) {
    const url = `/api/products/${id}`;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      headers: { 
        "Authorization": `JWT ${token}`,
        "Content-Type": "multipart/form-data"
      }
    };
    return this.put(url, formData, config);
  }
}

export default ProductsApiService;