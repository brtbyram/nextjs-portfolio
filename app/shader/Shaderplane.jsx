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
    varying vec2 vUv;
            uniform float uTime;
            void main() {
                float wave = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
                gl_FragColor = vec4(vec3(wave), 1.0);
        }`

function ShaderPlane() {

    const materialRef = useRef()

    useFrame(({ clock }) => {

        if (!materialRef.current) return
        materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    })

    return (
        <mesh>
            <planeGeometry args={[2, 2, 64, 64]} />
            <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={{ uTime: { value: 0 } }} />

        </mesh>

    )
}

export default ShaderPlane