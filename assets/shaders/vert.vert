    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColour;
    attribute vec3 aVertexNormal;

    uniform mat4 uMVMatrix;
    uniform mat4 uCMatrix;
    uniform mat4 uPMatrix;
    uniform mat4 modelMatrix;
    uniform vec3 lightDirection;

    varying vec4 color;

    void main(void) {
        float angleToLight = dot(aVertexNormal, lightDirection);
        angleToLight = angleToLight * 10.0;

        float colourMod = max(angleToLight, 0.0);
        highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);

        gl_Position = uPMatrix * uCMatrix * uMVMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
        color = vec4(ambientLight + aVertexColour * colourMod, 1.0);
    }