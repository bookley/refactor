/**
 * Created by Jamie on 25-Jul-15.
 */
define(["require", "exports"], function (require, exports) {
    var ImageMap = (function () {
        function ImageMap(texture, width, height, tileWidth, tileHeight) {
            this.width = width;
            this.height = height;
            this.texture = texture;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
        }
        ImageMap.prototype.getTexture = function () {
            return this.texture;
        };
        /**
         *
         * @param index
         * @returns {Array} The array of the texture positions of the four corners of the tile
         */
        ImageMap.prototype.getCoordsAtIndex = function (index) {
            var finalWidth = index * this.tileWidth;
            var x, y;
            if (finalWidth >= this.width) {
                var rowNum = Math.floor(finalWidth / this.width);
                var offset = finalWidth % this.width;
                x = offset;
                y = rowNum * this.tileHeight;
            }
            else {
                x = finalWidth;
                y = 0;
            }
            var result = [];
            //bottom left
            result.push(x / this.width);
            result.push((y + this.tileHeight) / this.height);
            //bottom right
            result.push((x + this.tileWidth) / this.width);
            result.push((y + this.tileHeight) / this.height);
            //top right
            result.push((x + this.tileWidth) / this.width);
            result.push(y / this.height);
            //top left
            result.push(x / this.width);
            result.push(y / this.height);
            return result;
        };
        ImageMap.prototype.doSomething = function () {
            return "hi";
        };
        return ImageMap;
    })();
    return ImageMap;
});
//# sourceMappingURL=imageMap.js.map