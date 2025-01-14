/**
 * A simple data model which stores the Kingmaker Stolen Lands region map game state data.
 */
export default class KingmakerState extends foundry.abstract.DataModel {

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      hexes: new fields.ObjectField()
    };
  }

  /* -------------------------------------------- */

  /**
   * Initialize state by loading from the world setting.
   * @returns {KingmakerState}
   */
  static load() {
    const data = game.settings.get("pf2e-kingmaker", "state");
    return this.fromSource(data);
  }

  /* -------------------------------------------- */

  /**
   * Save the region state to the world setting.
   * @returns {Promise<void>}
   */
  async save() {
    await game.settings.set("pf2e-kingmaker", "state", this.toObject());
  }

  /* -------------------------------------------- */

  /**
   * Reset the region state back to initial values for the adventure.
   * @returns {Promise<void>}
   */
  async reset() {

    // Prepare initial state
    const hexes = {};
    for ( const [hexString, {state}] of Object.entries(kingmaker.CONST.HEXES) ) {
      if ( !state ) continue;
      const [row, col] = hexString.split(".").map(Number);
      const key = kingmaker.api.KingmakerHex.getKey({row, col});
      hexes[key] = state;
    }

    // Save state
    this.updateSource({hexes}, {recursive: false});
    await this.save();

    // Replace Token on the Region Map
    if ( game.actors.party && kingmaker.region.scene ) {
      const token = await game.actors.party?.getTokenDocument({
        _id: game.actors.party.id,
        x: 7425,
        y: 239,
        texture: {
          src: "modules/pf2e-kingmaker/assets/actor-tokens/party/blue-default.webp"
        }
      });

      // Set the prototype token as well
      await game.actors.party?.update({ 
        prototypeToken: {
            texture: {
                src: "modules/pf2e-kingmaker/assets/actor-tokens/party/blue-default.webp"
            }
        } 
      });

      await kingmaker.region.scene.update({tokens: [token.toObject()]}, {recursive: false, noHook: true});
    }
  }
}
