"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameObject = require("../gameObject");
/**
 * Created by Jamie on 05-Jul-15.
 */
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(engine) {
        _super.call(this);
        this.engine = engine;
        this.setMesh(engine.graphics.assetCollection.getMesh("square"));
        this.setTexture(engine.graphics.assetCollection.getTexture("selectTile"));
    }
    return Tile;
}(GameObject));
module.exports = Tile;
//# sourceMappingURL=tile.js.map