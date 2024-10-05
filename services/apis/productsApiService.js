import BaseApiService from "./baseApiService";

class ProductsApiService extends BaseApiService {

  /**
   * Gets all products
   * @async
   * @param {{ pageSize: number|string, pageNum: number|string }} pagination 
   * @returns 
   */
  static async getAllProducts(pagination = { pageSize: 10, pageNum: 1 }) {
    const url = `/api/products?pageSize=${pagination.pageSize}&pageNum=${pagination.pageNum}`;
    return this.get(url);
  }

  /**
   * Gets all products from a given set
   * @async
   * @param {string} set set code
   * @returns 
   */
  static async getProductsBySet(set) {
    const url = `/api/products/set/${set}`
    return this.get(url)
  }

  /**
   * Gets a product details by its id
   * @async
   * @param {string} id 
   * @returns 
   */
  static async getProductById(id) {
    const url = `/api/products/${id}`;
    return this.get(url)
  }
}

export default ProductsApiService;