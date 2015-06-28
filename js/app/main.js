/**
 * Created by Jamie on 03-Apr-15.
 */

var assetUrls = [
    {url: "assets/shaders/frag.frag", name: "defaultFrag", type: "shader"},
    {url: "assets/shaders/vert.vert", name: "defaultVert", type: "shader" },
    {url: "assets/models/monkey.obj", name: "monkey", type: "mesh" }
]

define(["graphics/graphics", "graphics/assets", "camera/camera", "input", "game/scene", "game/scenegraph"], function(Graphics, Assets, Camera, Input, Scene, Scenegraph){
    function Engine(canvas) {
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
            self.graphics.SetLightDir([0, -1, 1]);
            scene.onStart();
            Draw();
        }).catch(function(err){
            console.error(err.stack);
        });
    }

    var engine = new Engine("mycanvas");
    var sceneGraph = new Scenegraph();
    var scene = new Scene(engine, sceneGraph);

    function Draw() {
        engine.input.Update();
        scene.onUpdate(0);

        engine.graphics.Draw(engine.camera, sceneGraph);
        window.requestAnimationFrame(Draw);
    }
});