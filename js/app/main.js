/**
 * Created by Jamie on 03-Apr-15.
 */

var assetUrls = [
    {url: "assets/shaders/frag.frag", name: "defaultFrag"},
    {url: "assets/shaders/vert.vert", name: "defaultVert"}
]

define(["graphics", "assets"], function(Graphics, Assets){
    function App(canvas) {
        var self = this;

        this.canvas = document.getElementById(canvas);
        this.graphics = new Graphics(this.canvas);
        this.assets = new Assets(assetUrls);
        this.assets.Load().then(function () {
            self.graphics.SetAssets(self.assets);
            self.graphics.LoadShader("defaultVert", "defaultFrag", "MainShader");
            self.graphics.UseShader("MainShader");
            self.graphics.CreateCube();
            Draw();
        });
    }

    function Draw() {
        App.graphics.Draw();
        window.requestAnimationFrame(Draw);
    }

    var App = new App("mycanvas");
});