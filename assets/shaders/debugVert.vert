    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColour;

    uniform mat4 uMVMatrix;
    uniform mat4 uCMatrix;
    uniform mat4 uPMatrix;

    varying vec4 color;

    void main(void) {
        gl_Position = uPMatrix * uCMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        color = vec4(aVertexColour, 1.0);
    }