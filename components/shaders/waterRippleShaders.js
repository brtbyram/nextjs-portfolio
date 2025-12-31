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

void main() {
    vec2 uv = vUv;
    if(frame == 0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    vec4 data = texture2D(textureA, uv);
    float pressure = data.x;
    float pVel = data.y; 

    vec2 texelSize = 1.0 / resolution;
    float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
    float p_left = texture2D(textureA, uv - vec2(texelSize.x, 0.0)).x;
    float p_up = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
    float p_down = texture2D(textureA, uv - vec2(0.0, texelSize.y)).x;

    vec2 texelBorder = texelSize * 2.0;
    if(uv.x <= texelBorder.x) p_left = p_right;
    if(uv.x >= 1.0 - texelBorder.x) p_right = p_left;
    if(uv.y <= texelBorder.y) p_down = p_up;
    if(uv.y >= 1.0 - texelBorder.y) p_up = p_down;

    pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
    pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;

    pressure += delta * pVel;
    pVel -= 0.005 * delta * pressure;

    pVel *= 1.0 - 0.002 * delta;
    pressure *= 0.999;

    vec2 mouseUV = mouse / resolution;
    if(mouse.x > 0.0) {
        float dist = distance(uv, mouseUV);
        if(dist < 0.02) {
            pressure += 2.0 * (1.0 - dist / 0.02);
        }
    }

    gl_FragColor = vec4(pressure, pVel, (p_right - p_left) / 2.0, (p_up - p_down) / 2.0);
}`;

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

    // Ripple datası
    vec4 data = texture2D(textureA, vUv);

    // Distortion hesaplama (şu anki pozisyon - orta nokta) * şiddet 
    vec2 distortion = (data.zw - 0.5) * 0.12;

    vec2 distortedUV = vUv + distortion;
    distortedUV = clamp(distortedUV, 0.02, 0.98);

    // Yazı texture'u
    vec4 text = texture2D(textTexture, distortedUV);

    // Arka plan rengi
    vec3 backgroundColor = backgroundColor;

    // Yazı rengi 
    vec3 textColor = textColor;

    // blend edelim ve son renki alalım ve alpha kanalıyla karıştıralım ve su hissi verelim
    vec3 color = mix(backgroundColor, textColor, text.a );

    // Hafif specular (su hissi)
    vec3 normal = normalize(vec3(-data.z * 2.0, 1.0, -data.w * 2.0)); 
    // Işık yönü
    vec3 lightDir = normalize(vec3(-2.0, 6.0, 3.0));
    // Specular hesaplama
    float spec = pow(max(dot(normal, lightDir), 0.0), 40.0) * 0.25; 

    color += spec;

    gl_FragColor = vec4(color, 1);
}
`;
