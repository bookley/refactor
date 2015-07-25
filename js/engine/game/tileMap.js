/**
 * Created by Jamie on 25-Jul-15.
 */
define(["require", "exports"], function (require, exports) {
    /**
     * Create an array of tiles with an imagemap put in
     * where each tile has a position, orientation and imageMap index
     */
    var TileMap = (function () {
        function TileMap(ctx) {
            this.tileRows = [];
            var bottomTileLevel = new TileLevel();
            for (var x = 0; x < 10; x++) {
                for (var y = 0; y < 10; y++) {
                    var tile = new TileMapTile(x, y, 0);
                    bottomTileLevel.tiles[x * 10 + y] = tile;
                }
            }
        }
        return TileMap;
    })();
    var TileLevel = (function () {
        function TileLevel() {
            this.tiles = [];
        }
        return TileLevel;
    })();
    var TileMapTile = (function () {
        function TileMapTile(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        return TileMapTile;
    })();
    return TileMap;
});
//# sourceMappingURL=tileMap.js.map