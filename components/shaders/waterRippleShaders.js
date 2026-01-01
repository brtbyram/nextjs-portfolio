export const simulationVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const simulationFragmentShader = `
uniform sampler2D textureA;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
uniform int frame;

varying vec2 vUv;

const float delta = 1.4;

/* random */
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {

    vec2 uv = vUv;

    if(frame == 0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    vec4 data = texture2D(textureA, uv);
    float pressure = data.x;
    float pVel = data.y;

    vec2 texel = 1.0 / resolution;

    float pR = texture2D(textureA, uv + vec2(texel.x, 0.0)).x;
    float pL = texture2D(textureA, uv - vec2(texel.x, 0.0)).x;
    float pU = texture2D(textureA, uv + vec2(0.0, texel.y)).x;
    float pD = texture2D(textureA, uv - vec2(0.0, texel.y)).x;

    if(uv.x <= texel.x) pL = pR;
    if(uv.x >= 1.0 - texel.x) pR = pL;
    if(uv.y <= texel.y) pD = pU;
    if(uv.y >= 1.0 - texel.y) pU = pD;

    /* wave */
    pVel += delta * (-2.0 * pressure + pR + pL) * 0.25;
    pVel += delta * (-2.0 * pressure + pU + pD) * 0.25;
    pressure += delta * pVel;

    /* damping */
    pVel *= 0.994;
    pressure *= 0.998;

    /* ===============================
        İLK 4 SANİYE RANDOM KONUMLARA DAMLA BIRAKMA 
       =============================== */

    if(time < 4.0) {

        // her frame 1 ihtimal → toplamda 4–5 damla
        float r = rand(vec2(float(frame), floor(time * 2.0))); 

        if(r > 0.920) {   // %8 ihtimal ile damla oluştur
            float dx = rand(vec2(frame, 1.0));
            float dy = rand(vec2(frame, 2.0));
            float dist = distance(uv, vec2(dx, dy));

            if(dist < 0.02) { 
                pressure += (1.0 - dist / 0.02) * 1.5; 
            }
        }
    }

    /* ===============================
        MOUSE DALGASI
       =============================== */

    vec2 mouseUV = mouse / resolution;
    if(mouse.x > 0.0) {
        float d = distance(uv, mouseUV);
        float r = 0.025;

        if(d < r) {
            pressure += (1.0 - d / r) * 2.0;
        }
    }

    gl_FragColor = vec4(
        pressure,
        pVel,
        (pR - pL) * 0.5,
        (pU - pD) * 0.5
    );
}
`;

export const renderVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const renderFragmentShader = `
uniform sampler2D textureA;
uniform sampler2D textTexture;
uniform vec2 resolution;
uniform vec3 backgroundColor;
uniform vec3 textColor;

varying vec2 vUv;

void main() {

    vec4 data = texture2D(textureA, vUv);

    vec2 distortion = data.zw * 0.13;
    vec2 distortedUV = vUv + distortion;
    distortedUV = clamp(distortedUV, 0.0, 1.0);

    vec4 text = texture2D(textTexture, distortedUV);

    vec3 color = mix(backgroundColor, textColor, text.a);

    // dalgayı gri tonlarda vurgula 
    vec3 grayColor = vec3(text.r * 0.299 + text.g * 0.587 + text.b * 0.114);
    text = vec4(grayColor, text.a);
    color = mix(backgroundColor, grayColor, text.a);

    // Işıklandırma efekti  
    vec3 normal = normalize(vec3(-data.z * 2.0, 1.0, -data.w * 2.0));
    vec3 lightDir = normalize(vec3(-2.0, 6.0, 3.0));
    float spec = pow(max(dot(normal, lightDir), 0.0), 40.0) * 1.8;

    color += spec;

    gl_FragColor = vec4(color, 1.0);
}
`;

export const grainVertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
