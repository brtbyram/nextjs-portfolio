"use client"

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

const vertexShader = `
uniform float uTime;
varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 pos = position;

  //
  pos.x = sin(uv.x + uTime);
   

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = `
  varying vec2 vUv;
    uniform float uTime;

  void main() {
    gl_FragColor = vec4(vUv.x, 0.0, 0.0, 1.0);
  }
`

export default function WavePlane() {
    const materialRef = useRef(null)

    useFrame((state) => {
        if (!materialRef.current) return
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    })

    return (
        <mesh>
            <planeGeometry args={[1, 1, 32, 32]} /> 
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 }
                }}
                    />
        </mesh>
    )
}