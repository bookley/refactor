/**
 * Created by Jamie on 03-Apr-15.
 */

var assetUrls = [
    {url: "assets/shaders/frag.frag", name: "defaultFrag"},
    {url: "assets/shaders/vert.vert", name: "defaultVert"}
]

define(["graphics", "assets", "camera", "input"], function(Graphics, Assets, Camera, Input){
    function App(canvas) {
        var self = this;

        this.canvas = document.getElementById(canvas);

        this.camera = new Camera();
        this.input = new Input(this.canvas);
        this.input.ControlCamera(this.camera)

        this.graphics = new Graphics(this.canvas);
        this.assets = new Assets(assetUrls);
        this.assets.Load().then(function () {
            self.graphics.SetAssets(self.assets);
            self.graphics.LoadShader("defaultVert", "defaultFrag", "MainShader");
            self.graphics.UseShader("MainShader");
            var cube = self.graphics.CreateCube();

            cube.SetPosition(0, 0, 0);
            Draw();
        }).catch(function(err){
            console.error(err.stack);
        });
    }

    var app = new App("mycanvas");

    function Draw() {
        app.input.Update();
        app.graphics.Draw(app.camera);
        window.requestAnimationFrame(Draw);
    }
});