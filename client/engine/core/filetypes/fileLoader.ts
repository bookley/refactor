export interface FileLoaderResult {
    vertices: number[];
    indices: number[];
    colors: number[];
    normals: number[];
    texCoords: number[];
}

export interface FileLoader {
    readFile(file:string):FileLoaderResult;
}