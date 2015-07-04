/**
 * Created by Jamie on 28-Jun-15.
 */
export class Scenegraph {
    graph:any[];

    constructor(){
        this.graph = [];
    }

    addEntity(entity){
        this.graph.push(entity);
    }
};