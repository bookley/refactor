import Context = require("core/context");

/**
 * Created by Jamie on 14-Sep-15.
 * Responsible for looking at a scenegraph and rendering it to a context
 */
class Renderer {
    context:Context.Context;

    constructor(context:Context.Context){
        this.context = context;
    }

    draw(shader, camera, scenegraph, lightDirection){
        if (!camera) throw new Error("Can't draw if a camera isn't set");

        shader.passMatrix("uCMatrix", camera.getMatrix());
        shader.passMatrix("pMatrix", camera.getPerspectiveMatrix());
        shader.passVec3("lightDirection", lightDirection);

        this.context.setDepthTestEnabled(true);

        //draw each entity in the scenegraph
        for (var i = 0; i < scenegraph.graph.length; i++) {
            var entity = scenegraph.graph[i];
            if(!entity.visible) continue;

            var modelMatrix = entity.getMatrix();
            if (entity.texture != null) {
                entity.texture.Bind();
            }
            entity.mesh.Draw(shader, modelMatrix);
        }
    }
}

export = Renderer;