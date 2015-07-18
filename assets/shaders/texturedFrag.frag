    precision mediump float;

    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    varying vec4 colour;

    void main(void) {
        vec4 texColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
        gl_FragColor = texColor * 0.7 + colour;
    }