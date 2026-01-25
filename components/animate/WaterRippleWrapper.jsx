import React, { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFBO, OrthographicCamera, RenderTexture, PerspectiveCamera, Text, Center, Text3D } from '@react-three/drei'
import {
    simulationVertexShader,
    simulationFragmentShader,
    renderVertexShader,
    renderFragmentShader,
    grainVertexShader,
    grainFragmentShader
} from '../shaders/waterRippleShaders'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

// 1. AYARLAR (Magic Number'lardan kurtulduk)
const CONFIG = {
    colors: {
        bg: new THREE.Color(10 / 255, 18 / 255, 97 / 255), // #0a1261
        text: new THREE.Color(255 / 255, 245 / 255, 186 / 255), // #FFF5BA
    },
    text: {
        content: 'murathan',
        font: '900 "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    sim: {
        quality: 1, // Varsayılan kalite
        highDpiScale: 0.45, // Retina ekran çarpanı
        lowDpiScale: 0.65, // Normal ekran çarpanı
    }
}



// 3. BOYUT HESAPLAYICI HOOK
function useSimulationDims(size, quality) {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
    const isHighDPI = dpr > 1
    const simScale = isHighDPI ? CONFIG.sim.highDpiScale : CONFIG.sim.lowDpiScale
    const pixelRatio = dpr * quality

    const width = Math.max(1, Math.floor(size.width * pixelRatio * simScale))
    const height = Math.max(1, Math.floor(size.height * pixelRatio * simScale))

    return { width, height, pixelRatio, simScale }
}

function RippleScene({ quality }) {
    const { gl, size, viewport } = useThree()
    const { width, height, pixelRatio } = useSimulationDims(size, quality)

    // FBO Ayarları
    const fboOptions = useMemo(() => ({
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false,
        stencilBuffer: false
    }), [])

    const bufferA = useFBO(width, height, fboOptions)
    const bufferB = useFBO(width, height, fboOptions)


    // Shader Material Tanımları
    const simMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            textureA: { value: null },
            mouse: { value: new THREE.Vector2(-10, -10) },
            resolution: { value: new THREE.Vector2(width, height) },
            frame: { value: 0 }
        },
        vertexShader: simulationVertexShader,
        fragmentShader: simulationFragmentShader
    }), [width, height])

    const renderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            textureA: { value: null },
            textTexture: { value: null },
            backgroundColor: { value: CONFIG.colors.bg },
            textColor: { value: CONFIG.colors.text },
        },
        vertexShader: renderVertexShader,
        fragmentShader: renderFragmentShader,
        transparent: true,
    }), [])

    const grainMaterial = useMemo(() => new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
            time: { value: 0 },
            opacity: { value: 0.08 },
            pixelSize: { value: 8000.0 },
        },
        vertexShader: grainVertexShader,
        fragmentShader: grainFragmentShader
    }), [])


    // Sahne (Tekrar tekrar oluşturmamak için memo dışında statik tutulabilir ama memo da ok)
    const simScene = useMemo(() => {
        const scene = new THREE.Scene()
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial)
        scene.add(mesh)
        return scene
    }, [simMaterial])

    const simCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])

    const dynamicFontSize = useMemo(() => {
        const textLength = CONFIG.text.content.length
        return (viewport.width / textLength) * 1.5 // 1.5 çarpanı fontun doluluğuna göre ayarlanabilir
    }, [viewport.width])

    // Yazıyı ekranın üst kısmına konumlandırmak için Y ekseni hesaplaması
    // viewport.height / 2 ekranın en üstüdür. Biraz boşluk bırakmak için 0.7 ile çarpıyoruz.
    const topPosition = (viewport.height / 2) * 0.7

    // Referanslar
    const currentBuffer = useRef(bufferA)
    const nextBuffer = useRef(bufferB)
    const frameCount = useRef(0)
    const mouseRef = useRef(new THREE.Vector2(-10, -10))
    const lastPointer = useRef(new THREE.Vector2(0, 0))
    const textRef = useRef()
    const materialRef = useRef()

    useFrame((state) => {
        const { gl, pointer, clock } = state

        // 1. MOUSE HAREKET KONTROLÜ
        // Sadece koordinat farkı varsa simülasyonu besliyoruz
        const distSq = pointer.distanceToSquared(lastPointer.current)
        const isMoving = distSq > 0.00001

        // 3. SİMÜLASYON KOORDİNAT GÜNCELLEME
        if (isMoving) {
            mouseRef.current.set(
                ((pointer.x + 1) / 2) * width,
                ((pointer.y + 1) / 2) * height
            )
        }

        // 4. GPGPU PING-PONG SİMÜLASYONU
        simMaterial.uniforms.frame.value = frameCount.current++

        simMaterial.uniforms.mouse.value = mouseRef.current
        simMaterial.uniforms.textureA.value = currentBuffer.current.texture

        // Render Pipeline
        gl.setRenderTarget(nextBuffer.current)
        gl.render(simScene, simCamera)
        gl.setRenderTarget(null)

        // Simülasyon verisini (textureA) ana materyale gönder
        renderMaterial.uniforms.textureA.value = nextBuffer.current.texture

        // Buffer Swap
        const temp = currentBuffer.current
        currentBuffer.current = nextBuffer.current
        nextBuffer.current = temp

        // Grain ve Pointer Takibi
        grainMaterial.uniforms.time.value = clock.getElapsedTime()
        lastPointer.current.copy(pointer)
    })

    return (
        <>

            <mesh>
                <planeGeometry args={[2, 2]} />
                <primitive object={renderMaterial} attach="material">
                    <RenderTexture attach="uniforms-textTexture-value" frames={Infinity}>
                        {/* 3. ÇÖZÜM: OrthographicCamera kullanımı tutarsızlığı bitirir */}
                        <OrthographicCamera
                            makeDefault
                            manual
                            top={viewport.height / 2}
                            bottom={-viewport.height / 2}
                            left={-viewport.width / 2}
                            right={viewport.width / 2}
                            near={-1}
                            far={1}
                            position={[0, 0, 0]}
                        />
                        <Center position={[0, topPosition, 0]} ref={textRef}>
                            <Text
                                fontSize={dynamicFontSize}
                                color="white"
                                fontWeight={700}
                                textAlign="center"
                                anchorX="center"
                                anchorY="middle"
                                maxWidth={viewport.width * 0.9}
                            >
                                {CONFIG.text.content}
                            </Text>
                        </Center>
                    </RenderTexture>

                </primitive>
            </mesh>
            <mesh>
                <planeGeometry args={[2, 2]} />
                <primitive object={grainMaterial} attach="material" />
            </mesh>

        </>
    )
}

// Wrapper Component
export default function WaterRippleWrapper({ children, quality }) {
    // Mount kontrolü (Next.js vb. SSR hatalarını önlemek için)
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    if (!mounted) return <div className="loading-placeholder" style={{ minHeight: '100vh' }}>{children}</div>

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>

            <div style={{ zIndex: 2 }}>
                {children}
            </div>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', willChange: 'transform' }}>
                <Canvas
                    dpr={[1, 2]}
                    camera={{ position: [0, 0, 1] }}
                    gl={{ antialias: false }}

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