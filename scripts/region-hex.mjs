/**
 * Individual hex metadata used to describe the Stolen Lands game state.
 * @property {string} zone
 * @property {string} terrain
 * @property {string} travel
 * @property {number} exploration
 * @property {boolean} cleared
 * @property {boolean} claimed
 * @property {string} [discovery]
 * @property {string} [commodity]
 * @property {string} [camp]
 */
export class KingmakerHexData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const C = kingmaker.CONST;
    return {
      zone: new fields.StringField({choices: C.ZONES, initial: "BV"}),
      terrain: new fields.StringField({choices: C.TERRAIN, initial: "plains"}),
      travel: new fields.StringField({choices: C.TRAVEL, initial: "open"}),
      exploration: new fields.NumberField({choices: Object.values(C.EXPLORATION_STATES).map(s => s.value), initial: 0}),
      cleared: new fields.BooleanField({initial: false}),
      claimed: new fields.BooleanField({initial: false}),
      discovery: new fields.StringField(),
      discovered: new fields.BooleanField({initial: false}),
      commodity: new fields.StringField({choices: C.COMMODITIES, blank: true, initial: ""}),
      camp: new fields.StringField({choices: C.CAMPS, blank: true, initial: ""}),
      page: new fields.StringField(),
      features: new fields.ArrayField(new fields.SchemaField({
        type: new fields.StringField({choices: C.FEATURES, initial: "landmark"}),
        name: new fields.StringField({blank: true}),
        discovered: new fields.BooleanField({initial: false})
      }))
    };
  }
}

export default class KingmakerHex extends GridHex {
  constructor(offset, config) {
    super(offset, config);
    /**
     * Game data regarding the hex.
     * @type {KingmakerHexData}
     */
    this.data = this.#initializeHex();
  }

  key = KingmakerHex.getKey(this.offset);

  /**
   * The name for the Hex.
   * If the hex links to a JournalEntryPage, the name of that page is used.
   * Otherwise, if the hex contains a discovery the discovery type is used.
   * Otherwise, the hex coordiantes are returned.
   * @type {string}
   */
  get name() {
    if ( this.data.page ) {
      const page = fromUuidSync(this.data.page);
      if ( page ) return page.name;
    }
    if ( this.data.discovery ) return this.discovery.label;
    return this.toString();
  }

  get zone() {
    return kingmaker.CONST.ZONES[this.data.zone];
  }

  get terrain() {
    return kingmaker.CONST.TERRAIN[this.data.terrain];
  }

  get travel() {
    return kingmaker.CONST.TRAVEL[this.data.travel];
  }

  get difficulty() {
    return kingmaker.CONST.TRAVEL[this.data.difficulty];
  }

  get discovery() {
    return kingmaker.CONST.DISCOVERY[this.data.discovery];
  }

  get explorationState() {
    return Object.values(kingmaker.CONST.EXPLORATION_STATES).find(s => s.value === this.data.exploration);
  }

  get color() {
    return this.zone.color;
  }

  /**
   * Initialize data for the hex
   * @returns {KingmakerHexData}
   */
  #initializeHex() {
    const initial = kingmaker.CONST.HEXES[this.toString()] || {};
    const state = kingmaker.state.hexes[this.key] || {};
    const zone = kingmaker.CONST.ZONES[initial.zone] || {};
    return KingmakerHexData.fromSource(Object.assign({terrain: zone.terrain, travel: zone.travel}, initial, state));
  }

  /* -------------------------------------------- */

  /**
   * Get a unique integer that identifies a hex using offset coordinates
   * @param {HexOffsetCoordinate} offset      The grid offset coordinate
   * @returns {number}                        The unique key
   */
  static getKey(offset) {
    return (1000 * offset.row) + offset.col;
  }

  /* -------------------------------------------- */

  /**
   * Express the hex as a string with format "{row}.{col}".
   * @returns {string}
   */
  toString() {
    return `${this.offset.row}.${this.offset.col}`;
  }
}
