"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameObject = require("./gameObject");
/**
 * Created by Jamie on 05-Jul-15.
 */
var Billboard = (function (_super) {
    __extends(Billboard, _super);
    function Billboard() {
        _super.call(this);
    }
    Billboard.prototype.setFixedOrientation = function (value) {
        this.fixed = value;
    };
    return Billboard;
}(GameObject));
exports.Billboard = Billboard;
//# sourceMappingURL=billboard.js.map