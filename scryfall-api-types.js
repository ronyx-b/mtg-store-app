/** ********** Start of type definitions from Scryfall API ********** */
/**
 * @typedef {("W" | "U" | "B" | "R" | "G")} Color
 */
/**
 * @typedef {Object} RelatedCard
 * @property {string} id
 * @property {"related_card"} object
 * @property {string} component
 * @property {string} name
 * @property {string} type_line
 * @property {string} uri
 */
/**
 * @typedef {Object} CardImages
 * @property {string} png
 * @property {string} border_crop
 * @property {string} art_crop
 * @property {string} large
 * @property {string} normal
 * @property {string} small
 */
/**
 * @typedef {Object} CardFace
 * @property {string} [artist]
 * @property {string} [artist_id]
 * @property {string} [cmc]
 * @property {Array<Color>} [color_indicator]
 * @property {Array<Color>} [colors]
 * @property {string} [defense]
 * @property {string} [flavor_text]
 * @property {string} [illustration_id]
 * @property {CardImages} [image_uris]
 * @property {string} [layout]
 * @property {string} [loyalty]
 * @property {string} mana_cost
 * @property {string} name
 * @property {"card_face"} object
 * @property {string} [oracle_id]
 * @property {string} [oracle_text]
 * @property {string} [power]
 * @property {string} [printed_name]
 * @property {string} [printed_text]
 * @property {string} [printed_type_line]
 * @property {string} [toughness]
 * @property {string} [type_line]
 * @property {string} [watermark]
 */
/**
 * @typedef {Object} Prices
 * @property {string} usd
 * @property {string} usd_foil
 * @property {string} usd_etched
 * @property {string} eur
 * @property {string} eur_foil
 * @property {string} eur_etched
 * @property {string} tix
 */
/**
 * @typedef {Object} Card
 * @property {number} [arena_id]
 * @property {string} id
 * @property {string} lang
 * @property {number} [mtgo_id]
 * @property {number} [mtgo_foil_id]
 * @property {number[]} [multiverse_ids]
 * @property {number} [tcgplayer_id]
 * @property {number} [tcgplayer_etched_id]
 * @property {number} [cardmarket_id]
 * @property {"card"} object
 * @property {string} layout
 * @property {string} [oracle_id]
 * @property {string} prints_search_uri
 * @property {string} rulings_uri
 * @property {string} scryfall_uri
 * @property {string} uri
 * @property {RelatedCard[]} [all_parts]
 * @property {CardFace[]} [card_faces]
 * @property {number} cmc
 * @property {Array<Color>} color_identity
 * @property {Array<Color>} [color_indicator]
 * @property {Array<Color>} [colors]
 * @property {string} [defense]
 * @property {number} [edhrec_rank]
 * @property {string} [hand_modifier]
 * @property {string[]} keywords
 * @property {Object} legalities
 * @property {string} [life_modifier]
 * @property {string} [loyalty]
 * @property {string} [mana_cost]
 * @property {string} name
 * @property {string} [oracle_text]
 * @property {number} [penny_rank]
 * @property {string} [power]
 * @property {Array<Color>} [produced_mana]
 * @property {boolean} reserved
 * @property {string} [toughness]
 * @property {string} type_line
 * @property {string} [artist]
 * @property {string[]} [artist_ids]
 * @property {any[]} [attraction_lights]
 * @property {boolean} booster
 * @property {string} border_color
 * @property {string} card_back_id
 * @property {string} collector_number
 * @property {boolean} [content_warning]
 * @property {boolean} digital
 * @property {Array<("foil" | "nonfoil" | "etched")>} finishes
 * @property {string} [flavor_name]
 * @property {string} [flavor_text]
 * @property {string[]} [frame_effects]
 * @property {string} frame
 * @property {boolean} full_art
 * @property {string[]} games
 * @property {boolean} highres_image
 * @property {string} [illustration_id]
 * @property {string} image_status
 * @property {CardImages} [image_uris]
 * @property {boolean} oversized
 * @property {Prices} prices
 * @property {string} [printed_name]
 * @property {string} [printed_text]
 * @property {string} [printed_type_line]
 * @property {boolean} promo
 * @property {string[]} [promo_types]
 * @property {Object} [purchase_uris]
 * @property {string} rarity
 * @property {Object} related_uris
 * @property {Date} released_at
 * @property {boolean} reprint
 * @property {string} scryfall_set_uri
 * @property {string} set_name
 * @property {string} set_search_uri
 * @property {string} set_type
 * @property {string} set_uri
 * @property {string} set
 * @property {string} set_id
 * @property {boolean} story_spotlight
 * @property {boolean} textless
 * @property {boolean} variation
 * @property {string} [variation_of]
 * @property {string} [security_stamp]
 * @property {string} [watermark]
 * @property {Date} [preview.previewed_at]
 * @property {string} [preview.source_uri]
 * @property {string} [preview.source]
 */
/**
 * @template T
 * @typedef {Object} List
 * @property {"list"} object 
 * @property {T[]} data 
 * @property {boolean} has_more 
 * @property {string} [next_page]
 * @property {number} total_cards
 * @property {string[]} warnings
 */
/**
 * @template T
 * @typedef {Object} CollectionList
 * @property {"list"} object 
 * @property {T[]} data 
 * @property {string[]} not_found
 */
/**
 * @typedef {Object} CardIdentifiers
 * @property {string} [id]
 * @property {number} [mtgo_id]
 * @property {number} [multiverse_id]
 * @property {string} [oracle_id]
 * @property {string} [illustration_id]
 * @property {string} [name]
 * @property {string} [collector_number]
 * @property {string} [set] (set code) used only in conjunction with {@link name} or {@link collector_number}
 */
/**
 * @typedef {"core" | "expansion" | "masters" | "alchemy" | "masterpiece" | "arsenal" | "from_the_vault" | "spellbook" | "premium_deck" | "duel_deck" | "draft_innovation" | "treasure_chest" | "commander" | "planechase" | "archenemy" | "vanguard" | "funny" | "starter" | "box" | "promo" | "token" | "memorabilia" | "minigame"} SetType
 */
/**
 * @typedef {Object} CardSet
 * @property {"set"} object
 * @property {string} id
 * @property {string} code
 * @property {string} [mtgo_code]
 * @property {string} [arena_code]
 * @property {number} [tcgplayer_id]
 * @property {string} name
 * @property {SetType} set_type
 * @property {Date} [released_at]
 * @property {string} [block_code]
 * @property {string} [block]
 * @property {string} [parent_set_code]
 * @property {number} card_count
 * @property {number} [printed_size]
 * @property {boolean} digital
 * @property {boolean} foil_only
 * @property {boolean} nonfoil_only
 * @property {string} scryfall_uri
 * @property {string} uri
 * @property {string} icon_svg_uri
 * @property {string} search_uri
 */
/**
 * @typedef {Object} CardSymbol
 * @property {"card_symbol"} object
 * @property {string} symbol
 * @property {string} [loose_variant]
 * @property {string} english
 * @property {boolean} transposable
 * @property {boolean} represents_mana
 * @property {number} [mana_value]
 * @property {boolean} appears_in_mana_costs
 * @property {boolean} funny
 * @property {Color[]} colors
 * @property {boolean} hybrid
 * @property {boolean} phyrexian
 * @property {string} [gatherer_alternates]
 * @property {string} [svg_uri]
 */

const ScryfallAPITypes = {};

export default ScryfallAPITypes;