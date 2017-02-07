    precision mediump float;

    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform sampler2D shadowSampler;

    varying float directionToLight;

    void main(void) {
        vec4 texColor = texture2D(shadowSampler, vec2(vTextureCoord.s, vTextureCoord.t));
        if(texColor.a <= 0.0)
            discard;

        gl_FragColor = vec4(texColor.rgb, 1.0);
    }