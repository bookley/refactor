define(["require", "exports"], function (require, exports) {
    /**
     * Created by Jamie on 25-Jul-15.
     */
    var ImageMap = (function () {
        function ImageMap(width, height, tileWidth, tileHeight) {
            this.width = width;
            this.height = height;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
        }
        /**
         *
         * @param index An index into the imageMap
         * @returns {{U: number, V: number}} The U and V coordinates of the resulting texture
         */
        ImageMap.prototype.getCoordsAtIndex = function (index) {
            var finalWidth = index * this.tileWidth;
            var x, y;
            if (finalWidth > this.width) {
                var rowNum = Math.ceil(this.width / finalWidth);
                var offset = finalWidth & this.width;
                x = offset;
                y = rowNum * this.tileHeight;
            }
            else {
                x = finalWidth;
                y = 0;
            }
            return {
                U: x / this.width,
                V: y / this.height
            };
        };
        return ImageMap;
    })();
    return ImageMap;
});
//# sourceMappingURL=imageMap.js.map