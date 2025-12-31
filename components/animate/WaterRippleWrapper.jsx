import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFBO, OrthographicCamera } from '@react-three/drei'
import {
    simulationVertexShader,
    simulationFragmentShader,
    renderVertexShader,
    renderFragmentShader
} from '../shaders/waterRippleShaders'


function RippleScene({ quality }) {
    const { gl, size } = useThree()

    /* ---------- RESOLUTION ---------- */
    const pixelRatio = Math.min(window.devicePixelRatio * quality, 2)
    const width = Math.max(1, Math.floor(size.width * pixelRatio))
    const height = Math.max(1, Math.floor(size.height * pixelRatio))

    /* ---------- FBO ---------- */
    const fboOptions = useMemo(
        () => ({
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            depthBuffer: false,
            stencilBuffer: false
        }),
        []
    )

    const textTexture = useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'rgba(0,0,0,0)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = `${Math.floor(width  / 5)}px "helvetica neue", helvetica, arial, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'white'
       

        ctx.fillText('murathan', canvas.width / 2, canvas.height / 2)

        
        const texture = new THREE.CanvasTexture(canvas)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.needsUpdate = true

        return texture
    }, [width, height])


    const bufferA = useFBO(width, height, fboOptions)
    const bufferB = useFBO(width, height, fboOptions)

    /* ---------- MATERIALS ---------- */
    const simMaterial = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    textureA: { value: null },
                    mouse: { value: new THREE.Vector2(-10, -10) },
                    resolution: { value: new THREE.Vector2(width, height) },
                    frame: { value: 0 }
                },
                vertexShader: simulationVertexShader,
                fragmentShader: simulationFragmentShader
            }),
        [width, height]
    )

    const renderMaterial = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    textureA: { value: null },
                    textTexture: { value: textTexture },
                    resolution: { value: new THREE.Vector2(width, height) },
                    backgroundColor: { value: new THREE.Color(253 / 255, 112 / 255, 36 / 255) },
                    textColor: { value: new THREE.Color(1.0, 0.96, 0.72) },
                },
                vertexShader: renderVertexShader,
                fragmentShader: renderFragmentShader,
                transparent: false
            }),
        [width, height, textTexture]
    )

    /* ---------- SIM SCENE ---------- */
    const simCamera = useMemo(
        () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
        []
    )

    const simScene = useMemo(() => {
        const scene = new THREE.Scene()
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial))
        return scene
    }, [simMaterial])


    /* ---------- REFS ---------- */
    const currentBuffer = useRef(bufferA)
    const nextBuffer = useRef(bufferB)
    const mouse = useRef(new THREE.Vector2(-10, -10))
    const frame = useRef(0)

    /* ---------- MOUSE ---------- */
    useEffect(() => {
        const handleMove = (e) => {
            const rect = gl.domElement.getBoundingClientRect()

            const x = (e.clientX - rect.left) * (size.width / rect.width)
            const y = (e.clientY - rect.top) * (size.height / rect.height)

            mouse.current.set(
                x * pixelRatio,
                (size.height - y) * pixelRatio
            )
        }

        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [gl, size, pixelRatio])

    /* ---------- FRAME LOOP ---------- */
    useFrame(() => {
        simMaterial.uniforms.frame.value = frame.current++
        simMaterial.uniforms.mouse.value = mouse.current
        simMaterial.uniforms.textureA.value = currentBuffer.current.texture

        gl.setRenderTarget(nextBuffer.current)
        gl.render(simScene, simCamera)
        gl.setRenderTarget(null)

        renderMaterial.uniforms.textureA.value =
            nextBuffer.current.texture

            ;[currentBuffer.current, nextBuffer.current] = [
                nextBuffer.current,
                currentBuffer.current
            ]
    })

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <primitive object={renderMaterial} attach="material" />
        </mesh>
    )
}

/* ===========================
   WRAPPER
=========================== */
export default function WaterRippleWrapper({ children, quality = 1 }) {

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 100)
        return () => clearTimeout(t)
    }, [])

    if (!mounted) return <div style={{ minHeight: '100vh' }}>{children}</div>

    return (
        <div style={{ height: '100vh', }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
                {children}
            </div>

            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: 'none',

                }}
            >
                <Canvas
                    dpr={[1, 2]} // bu kısım önemli çünkü yüksek ppi ekranlarda çok ağırlaşıyor 
                    resize={{ scroll: true }} 
                    gl={{ alpha: true, antialias: false }}
                >
                    <OrthographicCamera
                        makeDefault
                        position={[0, 0, 1]}
                        left={-1}
                        right={1}
                        top={1}
                        bottom={-1}
                    />
                    <RippleScene quality={quality} />
                </Canvas>
            </div>
        </div>
    )
}