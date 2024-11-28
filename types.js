/** ********** Collections Definitions ********** */
/**
 * @typedef {Object} Address
 * @property {string} [_id]
 * @property {string} name
 * @property {string} street
 * @property {string} city
 * @property {string} province
 * @property {string} postal
 */
/**
 * @typedef {Object} User
 * @property {string} [_id]
 * @property {string} name
 * @property {string} email
 * @property {string} [phone]
 * @property {Address[]} address
 * @property {string} defaultAddress
 * @property {boolean} isAdmin
 */
/**
 * @typedef {("single" | "sealed" | "accessory")} ProdType
 */
/**
 * @typedef {Object} Product
 * @property {string} [_id]
 * @property {string} name
 * @property {ProdType} prodType
 * @property {string} description
 * @property {string} cardSet
 * @property {number} price
 * @property {number} stock
 * @property {string} image
 */
/**
 * @typedef {Object} OrderItem
 * @property {string} [_id]
 * @property {ProdType} prodType
 * @property {string} prod_id
 * @property {string} name
 * @property {string} [cardSet]
 * @property {number} qty
 * @property {number} [price]
 */
/**
 * @typedef {Object} Order
 * @property {string} [_id]
 * @property {string} user_id
 * @property {Date} date
 * @property {number} number
 * @property {Address} address
 * @property {OrderItem[]} products
 */
/**
 * @typedef {Object} FeaturedSet
 * @property {string} [_id]
 * @property {string} name
 * @property {string} code
 * @property {Date} released_at
 * @property {string} scryfall_id
 * @property {string} hero
 * @property {boolean} featured
 */
/** ********** Start of type definitions for API requests ********** */
/**
 * @typedef {Object} Pagination Used for paginated requests and responses
 * @property {number | string} pageNum
 * @property {number | string} pageSize
 */
/**
 * @typedef {Pagination & {count: number}} PaginatedResult pagination and count for paginated results
 */
/**
 * @typedef {Object} BaseDataProcessingResponse
 * @property {boolean} [success]
 * @property {string} [message]
 */
/**
 * @typedef {Object} RegisterRequestBody
 * @property {string} name
 * @property {string} street
 * @property {string} city
 * @property {string} province
 * @property {string} postal
 * @property {string} email
 * @property {string} password
 * @property {string} password2
 */
/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 * @property {boolean} [keepLogged]
 */
/**
 * @typedef {BaseDataProcessingResponse & { token: string | null }} LoginResponse
 */
/**
 * @typedef {Object} ChangePasswordRequestBody
 * @property {string} oldPassword 
 * @property {string} newPassword
 * @property {string} confirmPassword
 * 
 * @typedef {BaseDataProcessingResponse & { addressId: string }} ManageAddressResponse
 */
/** ********** Miscellaneous portal types  ********** */
/**
 * @typedef {Object} NavLink
 * @property {string} title
 * @property {string} href
 */
/**
 * @typedef {Object} NavLinkExtraProperties
 * @property {boolean} display
 * @property {NavLink[]} [dropdown]
 */
/**
 * @typedef {NavLink & NavLinkExtraProperties} NavBarLink
 */

import * as ScryfallAPITypes from "@/scryfall-api-types";

const Types = { ...ScryfallAPITypes };

export default Types;