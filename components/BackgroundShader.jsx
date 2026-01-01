"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- GLSL KODU BAŞLIYOR ---

// Vertex Shader: Geometriyi belirler (Burada sadece düz bir kağıt gibi duruyor)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv; // Pikselin koordinatını Fragment Shader'a gönderiyoruz
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader: Rengi ve Efekti belirler (Sihir burada!)
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse; // React'ten gelen mouse pozisyonu (0 ile 1 arasında)
  uniform vec2 uResolution;
  
  varying vec2 vUv; // O an boyanan pikselin koordinatı (0,0 sol alt - 1,1 sağ üst)

  void main() {
    // 1. Mouse ile o anki piksel arasındaki mesafeyi ölçüyoruz
    float dist = distance(vUv, uMouse);

    // 2. Etki Alanı (Radius) Oluşturma
    // Eğer mesafe 0.2'den küçükse 'strength' artar.
    // smoothstep(kenar1, kenar2, değer) -> Yumuşak geçiş sağlar.
    float radius = 0.25;
    float strength = smoothstep(radius, 0.0, dist); 

    // 3. Renkleri Karıştırma
    vec3 colorBg = vec3(0.1, 0.1, 0.1); // Arka plan (Koyu Gri)
    vec3 colorMouse = vec3(0.0, 0.8, 1.0); // Mouse Rengi (Neon Mavi)

    // strength değerine göre iki rengi karıştır (mix)
    // strength 1 ise tamamen Mavi, 0 ise tamamen Gri olur.
    vec3 finalColor = mix(colorBg, colorMouse, strength);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// --- GLSL KODU BİTTİ ---

const ShaderPlane = () => {
  const meshRef = useRef();
  
  // Uniforms: GPU'ya göndereceğimiz veriler
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }, // Başlangıçta ortada
    }),
    []
  );

  // useFrame: Her karede (60 FPS) çalışır
  useFrame((state) => {
    const { clock, pointer } = state;
    
    // Zamanı güncelle (Dalgalanma vs istersen gerekir)
    meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();

    // Mouse Pozisyonunu Güncelle
    // R3F'de pointer -1 ile 1 arasındadır.
    // Shader UV'leri genelde 0 ile 1 arasındadır. Dönüştürmemiz lazım:
    // (-1, 1) -> (0, 1) dönüşümü: (x + 1) / 2
    meshRef.current.material.uniforms.uMouse.value.x = (pointer.x + 1) / 2;
    meshRef.current.material.uniforms.uMouse.value.y = (pointer.y + 1) / 2;
  });

  return (
    <mesh ref={meshRef}>
      {/* Ekranı kaplayan bir düzlem (Plane) */}
      <planeGeometry args={[2, 2]} /> 
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default function BackgroundShader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas>
        <ShaderPlane />
      </Canvas>
    </div>
  );
}