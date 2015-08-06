    precision mediump float;

    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    varying float directionToLight;

    void main(void) {
        vec4 texColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

        gl_FragColor =  + vec4((0.5 * texColor.rgb) +(0.5 * texColor.rgb * directionToLight), texColor.a);
    }