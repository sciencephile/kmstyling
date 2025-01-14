
/**
 * An Application instance that renders a HUD for a single hex on the Stolen Lands region map.
 */
export default class KingmakerHexHUD extends Application {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "kingmaker-hex-hud",
      classes: [kingmaker.CSS_CLASS],
      template: "modules/pf2e-kingmaker/templates/hex-hud.hbs",
      popOut: false,
      width: 920,
      height: "auto"
    });
  }

  /**
   * The target Hex that the HUD describes.
   * @type {KingmakerHex}
   */
  hex;

  /**
   * Is the hex hud enabled?
   * @type {boolean}
   */
  enabled = false;

  /* -------------------------------------------- */

  /** @override */
  _injectHTML(html) {
    this._element = html;
    document.getElementById("hud").appendChild(html[0]);
  }

  /* -------------------------------------------- */

  toggle(enabled) {
    enabled ??= !this.enabled;
    this.enabled = enabled;
    if ( enabled ) kingmaker.region.kingdomLayer.visible = true;
    else {
      kingmaker.region.kingdomLayer.visible = false;
      this.clear();
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData(options = {}) {
    const data = this.hex.data;
    return {
      id: this.options.id,
      cssClass: this.options.classes.join(" "),
      hex: this.hex,
      showDiscovery: this.hex.discovery && (game.user.isGM || this.hex.data.discovered),
      showDetails: game.user.isGM || (data.exploration > 0),
      explored: data.exploration > 0,
      zone: this.hex.zone,
      commodity: kingmaker.CONST.COMMODITIES[data.commodity],
      camp: kingmaker.CONST.CAMPS[data.camp],
      features: data.features.reduce((arr, f) => {
        if ( game.user.isGM || f.discovered ) arr.push({
          name: f.name || game.i18n.localize(kingmaker.CONST.FEATURES[f.type]?.label),
          icon: f.discovered ? "fa-check" : "fa-eye-slash"
        });
        return arr;
      }, [])
    }
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition({left, top}={}) {
    const position = {
      height: undefined,
      left: left,
      top: top,
      width: this.options.width
    };
    this.element.css(position);
  }

  /* -------------------------------------------- */

  /**
   * Activate this HUD element, binding it to a specific hex.
   * @param {KingmakerHex} hex    The target hex for the HUD
   * @returns {Promise<*>}
   */
  async activate(hex) {
    if ( !this.enabled ) return;
    this.hex = hex;
    const {x, y} = hex.topLeft;
    const options = {left: x + hex.config.width + 20, top: y};
    canvas.grid.clearHighlightLayer("KingmakerRegion");
    canvas.grid.highlightPosition("KingmakerRegion", {x, y, color: hex.color});
    return this._render(true, options);
  }

  /* -------------------------------------------- */

  /**
   * Clear the HUD.
   */
  clear() {
    let states = this.constructor.RENDER_STATES;
    canvas.grid.clearHighlightLayer("KingmakerRegion");
    if ( this._state <= states.NONE ) return;
    this._state = states.CLOSING;
    this.element.hide();
    this._element = null;
    this._state = states.NONE;
  }
}
