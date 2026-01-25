"use client"

import { useMemo } from "react"
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrthographicCamera } from "@react-three/drei"

// Shader stringlerini component dışına alıyoruz (Performans için)
const grainVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    // Tam ekran quad için pozisyonu direkt clip space'e atıyoruz
    gl_Position = vec4(position, 1.0); 
}`;

const grainFragmentShader = `
uniform float opacity;
uniform float pixelSize;
uniform float time;
varying vec2 vUv;

// Basit noise fonksiyonu
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    // vUv yerine gl_FragCoord kullanıyoruz. 
    // Bu sayede ekran genişlese bile pikseller kare kalır, uzamaz.
    vec2 pixelCoord = gl_FragCoord.xy;
    
    // Pikselleştirme işlemi
    vec2 pixelatedCoord = floor(pixelCoord / pixelSize);

    // Zamanla değişen noise
    float noise = random(pixelatedCoord + time * 0.5);

    // Noise rengi (Siyah-Beyaz arası)
    vec3 color = vec3(noise);

    // Çıktı
    gl_FragColor = vec4(color, opacity);
}
`;

function GrainShader() {
   const grainMaterial = useMemo(() => new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending, // veya THREE.NormalBlending
        depthWrite: false,
        depthTest: false,
        uniforms: {
            time: { value: 0 },
            opacity: { value: 0.05 }, // Görünürlüğü test etmek için 0.2 yapıp deneyin
            pixelSize: { value: 5.0 }, 
        },
        vertexShader: grainVertexShader,
        fragmentShader: grainFragmentShader
    }), [])

    useFrame((state) => {
        grainMaterial.uniforms.time.value = state.clock.elapsedTime;
    });

    return (
        <mesh frustumCulled={false}>
            <planeGeometry args={[2, 2]} />
            <primitive object={grainMaterial} attach="material" />
        </mesh>
    )
}

export default function GrainShaderWrapper() {
    return (
        <Canvas
            // 1. CSS ile Kesin Konumlandırma
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999, // Çok yüksek bir değer
                pointerEvents: 'none', // Tıklamaların arkaya geçmesi için ŞART
                background: 'transparent' // Canvas'ın kendi rengi olmasın
            }}
            // 2. WebGL Context Ayarları (Şeffaflık için kritik)
            gl={{
                alpha: true,         // Arka planın şeffaf olmasını sağlar
                antialias: false,
                stencil: false,
                depth: false,
                preserveDrawingBuffer: true
            }}
        >
            <OrthographicCamera makeDefault position={[0, 0, 1]} />
            <GrainShader />
        </Canvas>
    )
}