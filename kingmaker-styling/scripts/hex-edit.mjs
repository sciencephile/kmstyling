import {KingmakerHexData} from "./region-hex.mjs";

export default class KingmakerHexEdit extends FormApplication {

  /** @inheritDoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "kingmaker-hex-edit",
      classes: [kingmaker.CSS_CLASS],
      template: "modules/pf2e-kingmaker/templates/hex-edit.hbs",
      width: 420,
      height: "auto",
      popOut: true,
      closeOnSubmit: true
    });
  }

  static featurePartial = "modules/pf2e-kingmaker/templates/hex-edit-feature.hbs";

  get title() {
    return `Edit Hex: ${this.object.toString()}`;
  }

  /* -------------------------------------------- */

  async _render(force, options) {
    await loadTemplates([this.constructor.featurePartial])
    kingmaker.hexConfig = this;
    return super._render(force, options);
  }

  /* -------------------------------------------- */

  async close(options) {
    await super.close(options);
    kingmaker.hexConfig = null;
  }

  /* -------------------------------------------- */

  async getData(options) {
    return Object.assign(await super.getData(options), {
      camps: kingmaker.CONST.CAMPS,
      commodities: kingmaker.CONST.COMMODITIES,
      explorationStates: kingmaker.CONST.EXPLORATION_STATES,
      hex: this.object.data,
      features: kingmaker.CONST.FEATURES,
      featurePartial: this.constructor.featurePartial
    });
  }

  /* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {
    formData = foundry.utils.expandObject(formData);
    formData.features = formData.features ? Object.values(formData.features) : [];
    const state = KingmakerHexData.cleanData(formData, {partial: true});
    kingmaker.state.updateSource({
      hexes: {
        [this.object.key]: state
      }
    });
    await kingmaker.state.save();
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners(html) {
    super.activateListeners(html);
    html.on("click", "[data-action]", this.#onClickAction.bind(this));
  }

  /* -------------------------------------------- */

  async #onClickAction(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const action = button.dataset.action;
    switch ( action ) {
      case "addFeature": {
        const html = await renderTemplate(this.constructor.featurePartial, {
          id: foundry.utils.randomID(),
          type: "landmark",
          features: kingmaker.CONST.FEATURES
        });
        const fieldset = button.closest("fieldset");
        fieldset.insertAdjacentHTML("beforeend", html);
        this.setPosition({height: "auto"});
        break;
      }
      case "removeFeature": {
        const div = button.closest("div.form-group");
        div.remove();
        this.setPosition({height: "auto"});
        break;
      }
    }
  }
}
