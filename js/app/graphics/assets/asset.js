define(["require", "exports"], function (require, exports) {
    /**
     * Created by Jamie on 20-Jul-15.
     */
    var Asset = (function () {
        function Asset(data, name, type) {
            this.data = data;
            this.name = name;
            this.type = type;
        }
        return Asset;
    })();
    exports.Asset = Asset;
});
//# sourceMappingURL=asset.js.map