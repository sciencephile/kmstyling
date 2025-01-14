export {default as HEXES} from "./region-hexes.mjs";

/**
 * The default settings for each zone in the Stolen Lands region.
 * @enum {Readonly<{id: string, label: string, level: number, terrain: string, travel: string}>}
 */
export const ZONES = Object.freeze({
  NA: {
    id: "NA",
    label: "KINGMAKER.ZONES.NA",
    travel: "impassable",
  },
  BV: {
    id: "BV",
    label: "KINGMAKER.ZONES.BV",
    level: 0,
    terrain: "plains",
    travel: "open",
    color: Color.from("#bd2525")
  },
  RL: {
    id: "RL",
    label: "KINGMAKER.ZONES.RL",
    level: 1,
    terrain: "plains",
    travel: "open",
    color: Color.from("#d68910")
  },
  GB: {
    id: "GB",
    label: "KINGMAKER.ZONES.GB",
    level: 2,
    terrain: "hills",
    travel: "open",
    color: Color.from("#28b463")
  },
  TW: {
    id: "TW",
    label: "KINGMAKER.ZONES.TW",
    level: 3,
    terrain: "plains",
    travel: "open",
    color: Color.from("#1abc9c")
  },
  KL: {
    id: "KL",
    label: "KINGMAKER.ZONES.KL",
    level: 4,
    terrain: "hills",
    travel: "open",
    color: Color.from("#f1c40f")
  },
  NM: {
    id: "NM",
    label: "KINGMAKER.ZONES.NM",
    level: 5,
    terrain: "forest",
    travel: "difficult",
    color: Color.from("#1e8449")
  },
  SH: {
    id: "SH",
    label: "KINGMAKER.ZONES.SH",
    level: 6,
    terrain: "hills",
    travel: "open",
    color: Color.from("#28b463")
  },
  DS: {
    id: "DS",
    label: "KINGMAKER.ZONES.DS",
    level: 7,
    terrain: "plains",
    travel: "open",
    color: Color.from("#f1c40f")
  },
  NH: {
    id: "NH",
    label: "KINGMAKER.ZONES.NH",
    level: 8,
    terrain: "hills",
    travel: "open",
    color: Color.from("#FF5733")
  },
  LV: {
    id: "LV",
    label: "KINGMAKER.ZONES.LV",
    level: 9,
    terrain: "mountains",
    travel: "difficult",
    color: Color.from("#FF5733")
  },
  HT: {
    id: "HT",
    label: "KINGMAKER.ZONES.HT",
    level: 10,
    terrain: "swamp",
    travel: "greater",
    color: Color.from("#1abc9c")
  },
  DR: {
    id: "DR",
    label: "KINGMAKER.ZONES.DR",
    level: 11,
    terrain: "plains",
    travel: "open",
    color: Color.from("#bd2525")
  },
  TL: {
    id: "TL",
    label: "KINGMAKER.ZONES.TL",
    level: 12,
    terrain: "hills",
    travel: "open",
    color: Color.from("#d68910")
  },
  RU: {
    id: "RU",
    label: "KINGMAKER.ZONES.RU",
    level: 13,
    terrain: "plains",
    travel: "open",
    color: Color.from("#1abc9c")
  },
  GL: {
    id: "GL",
    label: "KINGMAKER.ZONES.GL",
    level: 14,
    terrain: "plains",
    travel: "open",
    color: Color.from("#28b463")
  },
  PX: {
    id: "PX",
    label: "KINGMAKER.ZONES.PX",
    level: 15,
    terrain: "plains",
    travel: "open",
    color: Color.from("#bd2525")
  },
  GU: {
    id: "GU",
    label: "KINGMAKER.ZONES.GU",
    level: 16,
    terrain: "hills",
    travel: "open",
    color: Color.from("#f1c40f")
  },
  NU: {
    id: "NU",
    label: "KINGMAKER.ZONES.NU",
    level: 17,
    terrain: "plains",
    travel: "open",
    color: Color.from("#d68910")
  },
  TV: {
    id: "TV",
    label: "KINGMAKER.ZONES.TV",
    level: 18,
    terrain: "forest",
    travel: "difficult",
    color: Color.from("#1e8449")
  },
  BR: {
    id: "BR",
    label: "KINGMAKER.ZONES.BR",
    level: 19,
    terrain: "mountains",
    travel: "greater",
    color: Color.from("#FF5733")
  },
});

/**
 * The progression of exploration states for an individual hex.
 * @type {Readonly<{NONE: number, RECON: number, MAP: number}>}
 */
export const EXPLORATION_STATES = Object.freeze({
  NONE: {value: 0, label: "KINGMAKER.EXPLORATION_STATES.NONE"},
  RECON: {value: 1, label: "KINGMAKER.EXPLORATION_STATES.RECON"},
  MAP: {value: 2, label: "KINGMAKER.EXPLORATION_STATES.MAP"}
});

/**
 * The terrain types which exist in the Stolen Lands region.
 * @enum {Readonly<{id: string, label: string, icon: string}>}
 */
export const TERRAIN = Object.freeze({
  plains: {
    id: "plains",
    label: "KINGMAKER.TERRAIN.PLAINS",
    icon: "modules/pf2e-kingmaker/assets/maps-regions/stolen-lands/terrain/plains.webp"
  },
  forest: {
    id: "forest",
    label: "KINGMAKER.TERRAIN.FOREST",
    icon: "modules/pf2e-kingmaker/assets/maps-regions/stolen-lands/terrain/forest.webp"
  },
  hills: {
    id: "hills",
    label: "KINGMAKER.TERRAIN.HILLS",
    icon: "modules/pf2e-kingmaker/assets/maps-regions/stolen-lands/terrain/hills.webp"
  },
  mountains: {
    id: "mountains",
    label: "KINGMAKER.TERRAIN.MOUNTAINS",
    icon: "modules/pf2e-kingmaker/assets/maps-regions/stolen-lands/terrain/mountains.webp"
  },
  wetlands: {
    id: "wetlands",
    label: "KINGMAKER.TERRAIN.WETLANDS",
    icon: "modules/pf2e-kingmaker/assets/maps-regions/stolen-lands/terrain/wetlands.webp"
  },
  swamp: {
    id: "swamp",
    label: "KINGMAKER.TERRAIN.SWAMP",
    icon: "modules/pf2e-kingmaker/assets/maps-regions/stolen-lands/terrain/swamp.webp"
  },
  lake: {
    id: "lake",
    label: "KINGMAKER.TERRAIN.LAKE",
    icon: "modules/pf2e-kingmaker/assets/maps-regions/stolen-lands/terrain/lake.webp"
  }
});

/**
 * The overland travel speeds encountered in the Stolen Lands region.
 * @enum {Readonly<{id: string, label: string, multiplier: number}>}
 */
export const TRAVEL = Object.freeze({
  open: {
    id: "open",
    label: "KINGMAKER.TRAVEL.OPEN",
    multiplier: 1
  },
  difficult: {
    id: "difficult",
    label: "KINGMAKER.TRAVEL.DIFFICULT",
    multiplier: 2
  },
  greater: {
    id: "greater",
    label: "KINGMAKER.TRAVEL.GREATER",
    multiplier: 3
  },
  water: {
    id: "water",
    label: "KINGMAKER.TRAVEL.WATER",
    multiplier: 1
  },
  impassable: {
    id: "impassable",
    label: "KINGMAKER.TRAVEL.IMPASSABLE",
    multiplier: Infinity
  }
});

/**
 * The encounter trait that indicates how easy it is to detect a feature while exploring.
 */
export const DISCOVERY = Object.freeze({
  landmark: {
    id: "landmark",
    label: "KINGMAKER.DISCOVERY.LANDMARK"
  },
  standard: {
    id: "standard",
    label: "KINGMAKER.DISCOVERY.STANDARD"
  },
  secret: {
    id: "secret",
    label: "KINGMAKER.DISCOVERY.SECRET"
  }
});

/**
 * The types of special "terrain features" that can exist on a hex in the Stolen Lands region.
 * @type {Readonly<{id: string, label: string}>}
 */
export const FEATURES = Object.freeze({
  landmark: {
    id: "landmark",
    label: "KINGMAKER.FEATURES.LANDMARK"
  },
  refuge: {
    id: "refuge",
    label: "KINGMAKER.FEATURES.REFUGE"
  },
  ruin: {
    id: "ruin",
    label: "KINGMAKER.FEATURES.RUIN"
  },
  structure: {
    id: "structure",
    label: "KINGMAKER.FEATURES.STRUCTURE"
  },
  bridge: {
    id: "bridge",
    label: "KINGMAKER.FEATURES.BRIDGE"
  },
  ford: {
    id: "ford",
    label: "KINGMAKER.FEATURES.FORD"
  },
  waterfall: {
    id: "waterfall",
    label: "KINGMAKER.FEATURES.WATERFALL"
  },
  hazard: {
    id: "hazard",
    label: "KINGMAKER.FEATURES.HAZARD"
  },
  farmland: {
    id: "farmland",
    label: "KINGMAKER.FEATURES.FARMLAND"
  },
  freehold: {
    id: "freehold",
    label: "KINGMAKER.FEATURES.FREEHOLD"
  },
  village: {
    id: "village",
    label: "KINGMAKER.FEATURES.VILLAGE"
  },
  town: {
    id: "town",
    label: "KINGMAKER.FEATURES.TOWN"
  },
  city: {
    id: "city",
    label: "KINGMAKER.FEATURES.CITY"
  },
  metropolis: {
    id: "metropolis",
    label: "KINGMAKER.FEATURES.METROPOLIS"
  }
});

/**
 * The resources which may exist in a particular hex of the Stolen Lands region.
 * @enum {Readonly<{id: string, label: string}>}
 */
export const COMMODITIES = Object.freeze({
  food: {
    id: "food",
    label: "KINGMAKER.COMMODITIES.FOOD"
  },
  ore: {
    id: "ore",
    label: "KINGMAKER.COMMODITIES.ORE"
  },
  lumber: {
    id: "lumber",
    label: "KINGMAKER.COMMODITIES.LUMBER"
  },
  luxuries: {
    id: "luxuries",
    label: "KINGMAKER.COMMODITIES.LUXURIES"
  },
  stone: {
    id: "stone",
    label: "KINGMAKER.COMMODITIES.STONE"
  }
});


/**
 * The types of work camps which exist in the Stolen Lands region.
 * @enum {Readonly<{id: string, label: string}>}
 */
export const CAMPS = Object.freeze({
  quarry: {
    id: "quarry",
    label: "KINGMAKER.CAMPS.QUARRY"
  },
  mine: {
    id: "mine",
    label: "KINGMAKER.CAMPS.MINE"
  },
  lumber: {
    id: "lumber",
    label: "KINGMAKER.CAMPS.LUMBER"
  }
});