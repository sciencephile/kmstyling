
/**
 * A custom implementation of PointSourcePolygon which restricts vision on the Stolen Lands map.
 */
export default class KingmakerHexSightPolygon extends PointSourcePolygon {

  /**
   * The amount of padding in pixels added to the explored hex region.
   * @type {number}
   */
  static PADDING = 20;

  /**
   * The cached point offsets of the FOW reveal area.
   */
  static POINTS = [[-1.5,-0.25], [-1,-0.5], [-1,-1], [-0.5,-1.25], [0,-1], [0.5,-1.25], [1,-1], [1,-0.5],
    [1.5,-0.25], [1.5,0.25], [1,0.5], [1,1], [0.5,1.25], [0,1], [-0.5,1.25], [-1,1], [-1,0.5], [-1.5,0.25]]

  /** @inheritDoc */
  initialize(origin, config) {
    super.initialize(origin, config);
    const cfg = this.config;
    if ( cfg.type !== "sight" ) {
      throw new Error("HexSightPolygon may only be used for sight polygons");
    }
  }

  /* -------------------------------------------- */

  /** @override */
  _compute() {
    const hex = kingmaker.region.getHexFromPoint(this.origin);
    this.points = KingmakerHexSightPolygon.getHexVisibilityPoints(hex);
  }

  /* -------------------------------------------- */

  /**
   * A static helper method to get the visibility polygon points from a provided hex.
   * @param {GridHex} hex         The provided hex
   * @returns {number[]}          The prepared polygon visibility points
   */
  static getHexVisibilityPoints(hex) {
    const c = hex.center;
    const {w, h} = canvas.grid.grid;
    const poly = [];
    for ( const [ox, oy] of this.POINTS ) {
      const x = c.x + (ox * w);
      const y = c.y + (oy * h);
      const r = new Ray(c, {x, y});
      const py = this.PADDING * Math.sin(r.angle);
      const px = this.PADDING * Math.cos(r.angle);
      poly.push(x + px, y + py);
    }
    return poly;
  }

  /* -------------------------------------------- */

  /** @override */
  applyConstraint() {
    return this;
  }
}
