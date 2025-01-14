/**
 * Options provided in the adventure importer
 * @type {Object<string, {label: string, default: boolean, handler: function, [hidden]: boolean}>}
 */
const IMPORT_OPTIONS = {
  resetState: {
    label: "KINGMAKER.IMPORTER.ResetState",
    default: false,
    get hidden() {
      return foundry.utils.isEmpty(kingmaker.state.hexes)
    },
    handler: (adventure, option) => kingmaker.state.reset()
  },
  activateScene: {
    label: "KINGMAKER.IMPORTER.ActivateScene",
    default: true,
    handler: async (adventure, option) => {
      game.scenes.get(option.sceneId)?.activate()
      const stolenLands = game.scenes.get("AJ1k5II28u72JOmz");
      await stolenLands.update({navigation: true});
    },
    sceneId: "lzuGwLYqNfID91d4"
  },
  displayJournal: {
    label: "KINGMAKER.IMPORTER.DisplayJournal",
    default: true,
    handler: (adventure, option) => game.journal.get(option.entryId)?.sheet.render(true),
    entryId: "yaBchpUYzl2Bo9Ch"
  },
  customizeJoin: {
    label: "KINGMAKER.IMPORTER.CustomizeWorld",
    default: false,
    background: "modules/pf2e-kingmaker/assets/journal-scenes/kingdom-exploration.webp",
    handler: async (adventure, option) => {
      const module = game.modules.get(kingmaker.id);
      const worldData = {
        action: "editWorld",
        id: game.world.id,
        description: module.description,
        background: option.background
      }
      await fetchJsonWithTimeout(foundry.utils.getRoute("setup"), {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(worldData)
      });
      game.world.updateSource(worldData);
    }
  }
};

/* -------------------------------------------- */

/**
 * Extend the AdventureImporter application for the Kingmaker adventure.
 * Add checkboxes for additional import options.
 * Patch the async prepareImport method for the Adventure document to handle compendium overrides.
 * @param {AdventureImporter} app     The importer application being rendered
 * @param {jQuery} html               The inner HTML rendered to the application
 */
export function onRenderAdventureImporter(app, html) {
  const adventure = app.object;
  if ( adventure.pack !== "pf2e-kingmaker.kingmaker" ) return;
  app.element[0].classList.add(kingmaker.CSS_CLASS);

  // Add import options
  let importOptions = `<section class="import-form"><h2>Importer Options</h2>`;
  for ( const [name, option] of Object.entries(IMPORT_OPTIONS) ) {
    if ( option.hidden ) continue;
    importOptions += `<div class="form-group">
        <label class="checkbox">
            <input type="checkbox" name="${name}" ${option.default ? "checked" : ""}/>
            ${game.i18n.localize(option.label)}
        </label>
      </div>`;
  }
  importOptions += `</section>`;
  html.find(".adventure-contents").append(importOptions);
  app.setPosition({height: "auto"});

  // Patch the Adventure document prepareImport method
  adventure.prepareImport = preparePathfinderImport.bind(adventure);
}

/* -------------------------------------------- */

/**
 * A patch used for the async Adventure#prepareImport method, applied specifically to a Kingmaker adventure.
 * @see {Adventure#prepareImport}
 * @override
 */
async function preparePathfinderImport(importOptions) {
  if ( this.pack !== "pf2e-kingmaker.kingmaker" ) {
    throw new Error(`preparePathfinderImport patch incorrectly applied to a non-Kingmaker Adventure document!`);
  }
  const importData = await Adventure.prototype.prepareImport.call(this, importOptions);

  // Preload full content for the Kingmaker Bestiary
  const kmb = game.packs.get("pf2e.kingmaker-bestiary");
  await kmb.getDocuments();

  // Prepare each individual Actor
  const actors = [...(importData.toCreate.Actor || []), ...(importData.toUpdate.Actor || [])];
  SceneNavigation.displayProgressBar({label: "Preparing Kingmaker Import", pct: 0});
  for ( const [i, actor] of actors.entries() ) {

    // Actors with no source ID can be skipped
    const sourceId = actor.flags?.core?.sourceId;
    if ( !sourceId ) continue;

    // Actors which have a different document ID than their source ID can be skipped
    const {uuid, documentId} = foundry.utils.parseUuid(sourceId);
    if ( actor._id !== documentId ) {
      console.debug(`Kingmaker | No compendium source data used for Actor "${actor.name}" [${actor._id}]`);
      continue;
    }

    // Load the compendium source data
    const sourceDocument = await fromUuid(uuid);
    const sourceData = sourceDocument.toObject();
    actor.system = sourceData.system;
    actor.items = sourceData.items;
    actor.effects = sourceData.effects;
    SceneNavigation.displayProgressBar({label: "Preparing Kingmaker Import", pct: Math.round(i * 100 / actors.length)});
  }
  SceneNavigation.displayProgressBar({label: "Preparing Kingmaker Import", pct: 100});
  return importData;
}

/* -------------------------------------------- */

/**
 * Once the adventure has been fully imported, apply import options that were selected by the user.
 * @param {Adventure} adventure       The adventure instance that was just imported
 * @param {object} importOptions      Options selected by the user at time of import
 */
export function onImportAdventure(adventure, importOptions) {
  if ( adventure.pack !== "pf2e-kingmaker.kingmaker" ) return;

  // Process import options
  for ( const [optionId, checked] of Object.entries(importOptions) ) {
    if ( !(optionId in IMPORT_OPTIONS) || !checked ) continue;
    const option = IMPORT_OPTIONS[optionId];
    option.handler(adventure, option);
  }

  // Always initialize state data if the option was hidden
  if ( !("resetState" in importOptions) ) kingmaker.state.reset()
}
