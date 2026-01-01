import React, { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFBO, OrthographicCamera, Text3D } from '@react-three/drei'
import {
    simulationVertexShader,
    simulationFragmentShader,
    renderVertexShader,
    renderFragmentShader,
    grainVertexShader,
    grainFragmentShader
} from '../shaders/waterRippleShaders'

// 1. AYARLAR (Magic Number'lardan kurtulduk)
const CONFIG = {
    colors: {
        bg: new THREE.Color(4 / 255, 49 / 255, 148 / 255),
        text: new THREE.Color(255 / 255, 255 / 255, 255 / 255),
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

// 2. TEXTURE OLUŞTURUCU HOOK (Mantığı ayırdık)
function useTextTexture(width, height) {
    return useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        // Temizlik
        ctx.fillStyle = 'rgba(0,0,0,0)'
        ctx.fillRect(0, 0, width, height)

        // Yazı Ayarları
        const fontSize = Math.floor(width / 5)
        ctx.font = `900 ${fontSize}px ${CONFIG.text.font.replace('900 ', '')}` // Font size dinamik
        ctx.textAlign = 'center'
        ctx.fillStyle = 'white'
        ctx.translate(0, -fontSize / 4)


        // Çizim
        ctx.fillText(CONFIG.text.content, width / 2, height * 0.4) // Ortalamayı basitleştirdik

        const texture = new THREE.CanvasTexture(canvas)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        return texture
    }, [width, height])
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
    const textTexture = useTextTexture(width, height)

    // Shader Material Tanımları
    const simMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            textureA: { value: null },
            mouse: { value: new THREE.Vector2(-10, -10) },
            resolution: { value: new THREE.Vector2(width, height) },
            frame: { value: 0 }
        },
        vertexShader: simulationVertexShader,
        fragmentShader: simulationFragmentShader,
    }), [width, height])

    const renderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            textureA: { value: null },
            textTexture: { value: textTexture },
            backgroundColor: { value: CONFIG.colors.bg },
            textColor: { value: CONFIG.colors.text },
        },
        vertexShader: renderVertexShader,
        fragmentShader: renderFragmentShader,
    }), [textTexture])

    const grainMaterial = useMemo(() => new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
            time: { value: 0 },
            opacity: { value: 0.18 },
            pixelSize: { value: 2400.0 },
        },
        vertexShader: grainVertexShader,
        fragmentShader: grainFragmentShader
    }), [])

    // Referanslar
    const currentBuffer = useRef(bufferA)
    const nextBuffer = useRef(bufferB)
    const frameCount = useRef(0)
    const mouseRef = useRef(new THREE.Vector2(-10, -10))

    // Sahne (Tekrar tekrar oluşturmamak için memo dışında statik tutulabilir ama memo da ok)
    const simScene = useMemo(() => {
        const scene = new THREE.Scene()
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial)
        scene.add(mesh)
        return scene
    }, [simMaterial])

    const simCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])

    // R3F Pointer Sistemini Kullanmak (Daha Temiz)
    useFrame((state) => {
        // 1. Mouse Koordinatlarını R3F state'inden al (Event listener'a gerek yok!)
        // Pointer normalde -1 ile 1 arasındadır, bunu doku boyutuna map ediyoruz.
        if (state.pointer.x !== 0 && state.pointer.y !== 0) {
            // Basitçe pointer'ı texture koordinatlarına çevirme:
            const mouseX = ((state.pointer.x + 1) / 2) * width
            const mouseY = ((state.pointer.y + 1) / 2) * height
            mouseRef.current.set(mouseX, mouseY)
        }

        // 2. Frame Skipping (30 FPS Simulation)


        // 3. Ping-Pong Simulation
        simMaterial.uniforms.frame.value = frameCount.current++
        simMaterial.uniforms.mouse.value = mouseRef.current
        simMaterial.uniforms.textureA.value = currentBuffer.current.texture

        gl.setRenderTarget(nextBuffer.current)
        gl.render(simScene, simCamera)
        gl.setRenderTarget(null)

        renderMaterial.uniforms.textureA.value = nextBuffer.current.texture

        // Ping-pong swap
        const temp = currentBuffer.current
        currentBuffer.current = nextBuffer.current
        nextBuffer.current = temp
        grainMaterial.uniforms.time.value += 0.016
    })

    return (
        <>
            <mesh>
                <planeGeometry args={[2, 2]} />
                <primitive object={renderMaterial} attach="material" />
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
            {/* HTML İÇERİK */}
            <div style={{ position: 'relative', zIndex: 10 }}>
                {children}
            </div>

            {/* CANVAS */}
            <div style={{
                position: 'absolute',
                inset: 0, // Top, Right, Bottom, Left = 0 demektir
                zIndex: 1
            }}>
                <Canvas
                    dpr={[1, 2]} // Cihazın kendi çözünürlüğüne izin ver ama 2'yi geçme
                    camera={{ position: [0, 0, 1] }}
                    gl={{ antialias: false }}
                    // Canvas'ın bulunduğu div'in boyutuna tam oturmasını sağlar
                    style={{ width: '100%', height: '100%' }}
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