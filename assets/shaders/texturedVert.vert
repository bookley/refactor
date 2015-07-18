    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColour;
    attribute vec3 aVertexNormal;
    attribute vec2 aTexCoords;

    uniform mat4 uMVMatrix;
    uniform mat4 uCMatrix;
    uniform mat4 uPMatrix;
    uniform vec3 lightDirection;

    varying vec4 colour;
    varying highp vec2 vTextureCoord;

    void main(void) {
        vec4 normal = uPMatrix * uCMatrix * uMVMatrix * vec4(aVertexNormal, 1.0);;
        float angleToLight = dot(normal, vec4(lightDirection, 1));
        angleToLight = max(angleToLight, 0.0);

        gl_Position = uPMatrix * uCMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        colour = vec4(aVertexColour * angleToLight, 1);
        vTextureCoord = aTexCoords;
    }