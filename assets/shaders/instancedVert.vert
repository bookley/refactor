    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTexCoords;

    uniform vec3 centre;
    uniform mat4 uCMatrix;
    uniform mat4 uPMatrix;
    uniform vec3 lightDirection;

    varying highp vec2 vTextureCoord;
    varying float directionToLight;

    void main(void) {
        vec4 normal = uMVMatrix * vec4(aVertexNormal, 0.0);
        float angleToLight = dot(normalize(normal), normalize(vec4(lightDirection, 0)));
        directionToLight = max(angleToLight, 0.0);

        gl_Position = uPMatrix * uCMatrix * uMVMatrix * vec4(aVertexPosition + centre, 1.0);
        vTextureCoord = aTexCoords;
    }