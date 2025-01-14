import KingmakerHex from "./region-hex.mjs";
import KingmakerHexHUD from "./hex-hud.mjs";
import KingmakerHexEdit from "./hex-edit.mjs";
import KingmakerHexSightPolygon from "./hex-sight.mjs";
import KingmakerKingdomLayer from "./kingdom-layer.mjs";

/**
 * A manager class responsible for orchestrating display and events on the Stolen Lands region map.
 */
export default class KingmakerRegionMap {
  constructor() {
    this.#initializeHexes();
    this.#initializeHUD();
  }

  /**
   * The Scene ID used for the Stolen Lands region map in the Kingmaker module.
   * @type {string}
   */
  static SCENE_ID = "AJ1k5II28u72JOmz";

  /**
   * A reference to the Stolen Lands region map Scene.
   * @type {Scene}
   */
  get scene() {
    return game.scenes.get(KingmakerRegionMap.SCENE_ID);
  }

  /**
   * Is the Kingmaker region map actively viewed on the canvas?
   * @type {boolean}
   */
  get active() {
    return canvas.scene?.id === KingmakerRegionMap.SCENE_ID;
  }

  /**
   * A mapping of hexes present in the region map
   * @type {Collection<number, KingmakerHex>}
   */
  hexes = new Collection();

  /**
   * The currently hovered hex.
   * @type {KingmakerHex|null}
   */
  hoveredHex = null;

  /**
   * The singleton HUD element used to tooltip a hex.
   * @type {KingmakerHexHUD}
   */
  hud;

  /**
   * The hex hover and edit tool.
   * @type {SceneControlTool}
   */
  #tool;

  /**
   * @type {KingmakerKingdomLayer}
   */
  kingdomLayer;

  /* -------------------------------------------- */
  /*  Initialization                              */
  /* -------------------------------------------- */

  #initializeHexes() {
    const config = HexagonalGrid.getConfig(2, 275);
    for ( let row=0; row<11; row++ ) {
      for ( let col=0; col<30; col++ ) {
        const hex = new KingmakerHex({row, col}, config);
        this.hexes.set(hex.key, hex);
      }
    }
  }

  #initializeHUD() {
    this.hud = new KingmakerHexHUD();
  }

  /* -------------------------------------------- */

  /**
   * Update display of the region map when Kingmaker state data changes.
   */
  onUpdateState() {
    this.#initializeHexes();
    if ( canvas.id === this.constructor.SCENE_ID ) this.kingdomLayer.draw();
  }

  /* -------------------------------------------- */

  getHexFromPoint(point) {
    const [row, col] = canvas.grid.grid.getGridPositionFromPixels(point.x, point.y);
    return this.hexes.get(KingmakerHex.getKey({row, col}));
  }

  /* -------------------------------------------- */
  /*  Canvas Lifecycle Hooks                      */
  /* -------------------------------------------- */

  /**
   * Canvas configuration.
   * @internal
   */
  _onConfig() {
    if ( !this.active ) return;
  }

  /* -------------------------------------------- */

  /**
   * Canvas initialization.
   * @internal
   */
  _onInit() {
    if ( !this.active ) return;
    if ( canvas.visibilityOptions ) canvas.visibilityOptions.persistentVision = true;
  }

  /* -------------------------------------------- */

  /**
   * Canvas drawing.
   * @internal
   */
  _onDraw() {
    if ( !this.active ) return;
    CONFIG.Canvas.polygonBackends.sight = KingmakerHexSightPolygon;
  }

  /* -------------------------------------------- */

  /**
   * Canvas ready.
   * @internal
   */
  _onReady() {
    if ( !this.active ) return;

    // Draw Kingdom Layer
    this.kingdomLayer = new KingmakerKingdomLayer();
    canvas.grid.addChildAt(this.kingdomLayer, canvas.grid.children.indexOf(canvas.grid.borders));
    this.kingdomLayer.draw();

    // Activate canvas events
    this.#mousemove = this.#onMouseMove.bind(this);
    canvas.stage.on("mousemove", this.#mousemove);
    if ( game.user.isGM ) {
      this.#mousedown = this.#onMouseDown.bind(this);
      canvas.stage.on("mousedown", this.#mousedown);
    }

    // Activate highlight layer
    canvas.grid.addHighlightLayer("KingmakerRegion");
  }

  /* -------------------------------------------- */

  /**
   * Canvas tear-down.
   * @internal
   */
  _onTearDown() {
    if ( !this.active ) return;

    // Unset certain variables
    this.hoveredHex = null;
    this.hud.clear();

    // Deactivate canvas events
    canvas.stage.off(this.#mousemove);
    this.#mousemove = undefined;
    canvas.stage.off(this.#mousedown);
    this.#mousedown = undefined;

    // Reset sight polygon backend
    CONFIG.Canvas.polygonBackends.sight = ClockwiseSweepPolygon;

    // Activate highlight layer
    canvas.grid.destroyHighlightLayer("KingmakerRegion");
  }

  /* -------------------------------------------- */

  /**
   * Add special buttons to the scene controls palette when we are on the region map.
   * @param buttons
   * @internal
   */
  _extendSceneControlButtons(buttons) {
    if ( canvas.id !== this.constructor.SCENE_ID ) return;
    const tokens = buttons.find(b => b.name === "token");
    this.#tool = {
      name: "hex",
      title: "KINGMAKER.ToggleHexTool",
      icon: "fa-solid fa-hexagon-image",
      visible: true,
      toggle: true,
      active: this.hud.enabled ?? false,
      onClick: () => this.hud.toggle()
    };
    tokens.tools.push(this.#tool);
  }

  /* -------------------------------------------- */
  /*  Canvas Event Handlers                       */
  /* -------------------------------------------- */

  /**
   * A bound event handler function
   * @type {function}
   */
  #mousemove;

  /**
   * A bound mousedown handler function
   * @type {function}
   */
  #mousedown;

  /**
   * Track the last left-click time to detect double-clicks
   * @type {number}
   */
  #clickTime = 0;

  /* -------------------------------------------- */

  /**
   * Handle mousemove events to display hex data.
   * @param {PIXI.InteractionEvent} event
   * @private
   */
  #onMouseMove(event) {
    let hex = null;
    if ( this.hud.enabled && (event.srcElement?.id === "board") ) {
      hex = this.getHexFromPoint(event.data.getLocalPosition(canvas.stage));
    }
    if ( !hex ) this.hud.clear();
    else if ( hex !== this.hoveredHex ) this.hud.activate(hex);
    this.hoveredHex = hex || null;
  }

  /* -------------------------------------------- */

  /**
   * Handle mousedown events to edit a specific hex data.
   * @param {PIXI.InteractionEvent} event
   */
  #onMouseDown(event) {
    if ( !this.hoveredHex ) return;
    const t0 = this.#clickTime;
    const t1 = this.#clickTime = Date.now();
    if ( (t1 - t0) > 250 ) return;
    const hex = this.hoveredHex;
    const app = new KingmakerHexEdit(hex);
    app.render(true, {left: event.x + 100, top: event.y - 50});
  }
}
