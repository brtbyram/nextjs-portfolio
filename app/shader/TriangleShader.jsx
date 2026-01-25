"use client"

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'


const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

void main() {
  // UV'yi kopyala
  vec2 uv = vUv;

  // UV uzayını zamanla kaydır
  uv.x += sin(uv.y + uTime) * 0.1;
    uv.y += cos(uv.x + uTime) * 0.1;




  // tekrar grid çiz
  float gridX = step(0.94, fract(uv.x * 10.0));
  float gridY = step(0.94, fract(uv.y * 10.0));
  float grid = max(gridX, gridY);

  vec3 color = mix(
    vec3(uv, 0.0),
    vec3(1.0),
    grid
  );

  gl_FragColor = vec4(color, 1.0);
}`

function TriangleShader() {

    const materialRef = useRef()
    const positions = new Float32Array([
        0.0, 0.0, 0.0, // 1
        -1.0, -1.0, 0.0, // 0 
        -1.0, 0.0, 0.0, // 2

        0.0, 0.0, 0.0, // 3
        1.0, 1.0, 0.0, // 4
        1.0, 0.0, 0.0, // 5

        0.0, 0.0, 0.0, // 6
        1.0, 1.0, 0.0, // 8
        -1.0, 0.0, 0.0, // 7

        0.0, 0.0, 0.0, // 9
        -1.0, -1.0, 0.0, // 11
        1.0, 0.0, 0.0, // 10
    ]);

    // UV haritası
    const uvs = new Float32Array([
        // 1. üçgen
        0.0, 0.0, // 1
        0.0, 1.0, // 0
        1.0, 1.0, // 2

        // 2. üçgen
        0.0, 0.0, // 0
        0.0, 1.0, // 1
        1.0, 1.0, // 2

        // 3. üçgen
        0.0, 0.0, // 0
        0.0, 1.0, // 2
        1.0, 1.0, // 1

        // 4. üçgen
        0.0, 0.0, // 0
        0.0, 1.0, // 2
        1.0, 1.0, // 1

    ]);

    // iki üçgen (index buffer)
    const indices = new Uint16Array([
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
            materialRef.current.side = THREE.DoubleSide;
        }
    });
    return (
        <mesh geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{ uTime: { value: 0 } }}
            />
        </mesh>
    )
}

export default TriangleShader