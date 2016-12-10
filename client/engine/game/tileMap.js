/**
 * Created by Jamie on 25-Jul-15.
 */
"use strict";
var TileMap = (function () {
    function TileMap(tileWidth, tileHeight) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileLevels = [];
        this.isInvalidated = true;
    }
    TileMap.prototype.setImageMap = function (imageMap) {
        this.imageMap = imageMap;
    };
    TileMap.prototype.getImageMap = function () {
        return this.imageMap;
    };
    TileMap.prototype.getTileLevels = function () {
        return this.tileLevels;
    };
    TileMap.prototype.getTileWidth = function () {
        return this.tileWidth;
    };
    TileMap.prototype.getTileHeight = function () {
        return this.tileHeight;
    };
    TileMap.prototype.reset = function () {
        this.isInvalidated = false;
    };
    TileMap.prototype.invalidate = function () {
        this.isInvalidated = true;
    };
    return TileMap;
}());
exports.TileMap = TileMap;
var TileLevel = (function () {
    function TileLevel(invalidationListener) {
        this.tiles = [];
        this.invalidationListener = invalidationListener;
    }
    TileLevel.prototype.getTiles = function () {
        return this.tiles;
    };
    TileLevel.prototype.setTiles = function (tileMapTiles) {
        this.tiles = tileMapTiles;
        this.invalidationListener.invalidate();
    };
    TileLevel.prototype.setTile = function (index, tile) {
        this.tiles[index] = tile;
        this.invalidationListener.invalidate();
    };
    return TileLevel;
}());
exports.TileLevel = TileLevel;
var TileMapTile = (function () {
    function TileMapTile(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.imageMapIndex = 0;
    }
    TileMapTile.prototype.setImageMapIndex = function (index) {
        this.imageMapIndex = index;
    };
    TileMapTile.prototype.getImageMapIndex = function () {
        return this.imageMapIndex;
    };
    return TileMapTile;
}());
exports.TileMapTile = TileMapTile;
//# sourceMappingURL=tileMap.js.map