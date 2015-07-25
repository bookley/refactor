/**
 * Created by Jamie on 05-Jul-15.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "game/gameObject", "engine"], function (require, exports, GameObject, Engine) {
    engine: Engine;
    var Tile = (function (_super) {
        __extends(Tile, _super);
        function Tile(engine) {
            _super.call(this);
            this.engine = engine;
            this.setMesh(engine.graphics.assetCollection.getMesh("square"));
            this.setTexture(engine.graphics.assetCollection.getTexture("exclamation"));
            var orientation = mat4.create();
            //mat4.rotateX(orientation, orientation, Math.PI / 2);
            //this.setOrientation(orientation);
            //this.y = -10;
        }
        return Tile;
    })(GameObject);
    return Tile;
});
//# sourceMappingURL=tile.js.map