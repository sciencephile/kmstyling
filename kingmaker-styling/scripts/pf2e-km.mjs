import * as CONST from "./const.mjs";
import KingmakerHex from "./region-hex.mjs";
import {KingmakerJournalSheet} from "./journal-sheet.mjs";
import KingmakerRegion from "./region.mjs";
import KingmakerState from "./region-state.mjs";
import KingmakerHexHUD from "./hex-hud.mjs";
import KingmakerKingdomLayer from "./kingdom-layer.mjs";
import {onImportAdventure, onRenderAdventureImporter} from "./importer.mjs";

/**
 * The Kingmaker module ID
 * @type {string}
 */
const MODULE_ID = "pf2e-kingmaker";

/**
 * @typedef {Module} Kingmaker
 * @property {object} CONST
 * @property {string} CSS_CLASS
 * @property {object} api
 * @property {KingmakerRegion} region
 * @property {KingmakerState} state
 */

/* -------------------------------------------- */
/*  Initialization                              */
/* -------------------------------------------- */

Hooks.once("init", function() {

  /**
   * Global reference to the Kingmaker module.
   * @type {Kingmaker}
   */
  globalThis.kingmaker = game.modules.get(MODULE_ID);

  /**
   * Constants used by the Kingmaker module.
   * @type {object}
   */
  kingmaker.CONST = CONST;

  /**
   * The CSS class used to identify Kingmaker applications.
   * @type {string}
   */
  kingmaker.CSS_CLASS = "pf2e-km";

  /**
   * Public API for the Kingmaker module.
   * @type {object}
   */
  kingmaker.api = {
    KingmakerHex,
    KingmakerHexHUD,
    KingmakerRegion,
    KingmakerState,
    KingmakerKingdomLayer
  };

  // Register sheets
  DocumentSheetConfig.registerSheet(JournalEntry, MODULE_ID, KingmakerJournalSheet, {
    types: ["base"],
    label: "Pathfinder Kingmaker",
    makeDefault: false
  });

  // Register Settings
  game.settings.register(MODULE_ID, "state", {
    name: "Stolen Lands Region State",
    scope: "world",
    config: false,
    requiresReload: false,
    type: KingmakerState,
    default: {},
    onChange: value => {
      kingmaker.state = value
      kingmaker.region.onUpdateState();
    }
  });

  // One-time startup prompt
  game.settings.register(MODULE_ID, "startup", {
    name: "One-Time Startup Prompt",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });
});


Hooks.once("ready", async function() {
  // Set campaignType to Kingmaker
  game.settings.set("pf2e", "campaignType", "kingmaker");

  // Imported state.
  game.settings.register(MODULE_ID, "imported", {
    scope: "world",
    type: Boolean,
    config: false,
    default: game.journal.has("yaBchpUYzl2Bo9Ch")
  });

  // Launch the Adventure importer if first startup
  const module = game.modules.get(MODULE_ID);
  const firstStartup = game.settings.get(MODULE_ID, "startup") === false;
  if ( firstStartup ) {
    for ( const p of module.packs ) {
      const pack = game.packs.get(`${MODULE_ID}.${p.name}`);
      const adventures = await pack.getDocuments();
      for ( const adventure of adventures ) {
        adventure.sheet.render(true);
      }
    }

    if (game.actors.party.prototypeToken.texture.src === "systems/pf2e/icons/default-icons/party.svg") {
      // Set the party token to use the default token
      await game.actors.party?.update({ 
        prototypeToken: {
            texture: {
                src: "modules/pf2e-kingmaker/assets/actor-tokens/party/blue-default.webp"
            }
        } 
      });
    }

    game.settings.set(MODULE_ID, "startup", true);
  }
})

/* -------------------------------------------- */

Hooks.once("setup", function() {

  /**
   * A singleton reference to the KingmakerState game state instance.
   * @type {KingmakerState}
   */
  kingmaker.state = KingmakerState.load();

  /**
   * A singleton reference to the KingmakerRegion instance.
   * @type {KingmakerRegion}
   */
  kingmaker.region = new KingmakerRegion();
});

/* -------------------------------------------- */
/*  Canvas Events                               */
/* -------------------------------------------- */

Hooks.on("canvasConfig", () => kingmaker.region._onConfig());
Hooks.on("canvasInit", () => kingmaker.region._onInit());
Hooks.on("canvasDraw", () => kingmaker.region._onDraw());
Hooks.on("canvasReady", () => kingmaker.region._onReady());
Hooks.on("canvasTearDown", () => kingmaker.region._onTearDown());
Hooks.on("getSceneControlButtons", buttons => kingmaker.region._extendSceneControlButtons(buttons));

/* -------------------------------------------- */
/*  Journal Rendering                           */
/* -------------------------------------------- */

Hooks.on("renderJournalPageSheet", (app, html) => {
  const doc = app.document;
  const journalFlag = doc.parent.sheet instanceof KingmakerJournalSheet;
  if ( !journalFlag ) return;
  html.addClass(kingmaker.CSS_CLASS);
})

/* -------------------------------------------- */
/*  Importer Events                             */
/* -------------------------------------------- */

Hooks.on("renderAdventureImporter", onRenderAdventureImporter);
Hooks.on("importAdventure", onImportAdventure)