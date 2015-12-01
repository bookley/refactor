/**
 * Created by Jamie on 05-Jul-15.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "game/gameObject"], function (require, exports, GameObject) {
    var Billboard = (function (_super) {
        __extends(Billboard, _super);
        function Billboard() {
            _super.call(this);
        }
        Billboard.prototype.setFixedOrientation = function (value) {
            this.fixed = value;
        };
        return Billboard;
    })(GameObject);
    exports.Billboard = Billboard;
});
//# sourceMappingURL=billboard.client.map