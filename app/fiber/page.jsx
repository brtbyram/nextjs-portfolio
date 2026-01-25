"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function MotionDrivenBox() {
    const meshRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const prevFrameRef = useRef(null);

    const [motion, setMotion] = useState(0);

    useEffect(() => {
        const video = document.createElement("video");
        video.autoplay = true;
        video.playsInline = true;

        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            video.srcObject = stream;
        });

        const canvas = document.createElement("canvas");
        canvas.width = 1600;
        canvas.height = 1200;

        videoRef.current = video;
        canvasRef.current = canvas;
    }, []);

    useEffect(() => {
        let rafId;

        const detectMotion = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            if (prevFrameRef.current) {
                let diff = 0;

                for (let i = 0; i < frame.length; i += 4) {
                    diff += Math.abs(frame[i] - prevFrameRef.current[i]);
                }

                setMotion(diff / frame.length);
            }

            prevFrameRef.current = new Uint8ClampedArray(frame);
            rafId = requestAnimationFrame(detectMotion);
        };

        detectMotion();
        return () => cancelAnimationFrame(rafId);
    }, []);

    useFrame(() => {
        if (!meshRef.current) return;

        // motion değerini yumuşatıp sahneye aktarıyoruz
        meshRef.current.position.x = THREE.MathUtils.lerp(
            meshRef.current.position.x,
            motion * 0.05,
            0.1
        );
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink" />
        </mesh>
    );
}

export default function Page() {
    return (
        <div className="w-screen h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight />
                <directionalLight position={[3, 3, 3]} />
                <MotionDrivenBox />
            </Canvas>
        </div>
    );
}