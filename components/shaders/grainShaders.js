export const grainVertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position.x, position.y, 0.0, 1.0);
}`;

export const grainFragmentShader = `
uniform float opacity;
uniform float pixelSize;
uniform float time;
varying vec2 vUv;

// basit ve ucuz noise
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    // pixel hissi
    vec2 pixelUv = floor(vUv * pixelSize) / pixelSize;

    float n = random(pixelUv + time * 0.5);

    // renkli ama çok hafif
    vec3 grainColor = vec3(n);

    // TRANSPARENT OVERLAY
    gl_FragColor = vec4(grainColor, opacity);
}
`;
