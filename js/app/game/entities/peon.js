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
    var Peon = (function (_super) {
        __extends(Peon, _super);
        function Peon(engine) {
            _super.call(this);
            this.maxX = -100;
            this.maxZ = -100;
            this.timer = 0;
            this.nextChange = 0;
            this.engine = engine;
            this.setMesh(engine.graphics.GetMesh("man"));
            this.setTexture(engine.graphics.GetTexture("mantexture"));
            this.setScaleSingle(1);
            //this.pickRandomPosition();
            this.randomOrientation();
            this.y = -5;
        }
        Peon.prototype.pickRandomPosition = function () {
            var randomX = Math.random() * this.maxX + 50;
            var randomZ = Math.random() * this.maxZ + 50;
            this.setPosition(randomX, -10, randomZ);
        };
        Peon.prototype.randomOrientation = function () {
            this.direction = vec2.fromValues(Math.random() * 2 - 1, Math.random() * 2 - 1);
            vec2.normalize(this.direction, this.direction);
            this.nextChange = Math.random() * 150 + 10;
        };
        Peon.prototype.update = function () {
            return;
            this.timer++;
            if (this.timer > this.nextChange) {
                this.randomOrientation();
                this.timer = 0;
            }
            this.x += this.direction[0] * 0.1;
            this.z += this.direction[1] * 0.1;
            if (this.x > 50 || this.x < -50) {
                this.direction[0] *= -1;
            }
            if (this.z > 50 || this.z < -50) {
                this.direction[1] *= -1;
            }
        };
        return Peon;
    })(GameObject);
    exports.Peon = Peon;
});
//# sourceMappingURL=peon.js.map