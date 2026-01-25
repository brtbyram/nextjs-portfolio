"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./blog.module.css";
import { useGSAP } from "@gsap/react";
import { createPortal } from "react-dom";


const BlogPage = () => {
    const cubeRef = useRef(null);
    const sceneRef = useRef(null);
    const containerRef = useRef(null);

    // GSAP eklentilerini kaydet
    gsap.registerPlugin(ScrollTrigger);

    useGSAP(() => {
        const faces = cubeRef.current?.children;
        const scene = sceneRef.current;


        const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

        // 1. Başlangıç Pozisyonu: Yan yana dizilim (Giriş)
        tl.fromTo(faces,
            {
                x: (i) => (i - 2.5) * 0,
                y: 0,
                rotationZ: 0,
                opacity: 0,
            },
            {
                x: (i) => (i - 2.5) * 300,
                y: 0,
                rotationZ: 0,
                opacity: 1,
                duration: 3,
                delay: 1.5,
                stagger: 0.1,
            }
        )

            // 2. Küp Formuna Dönüşme (2 saniye sonra)
            .to(faces, {
                x: (i, target) => target.dataset.x || 0,
                y: (i, target) => target.dataset.y || 0,
                rotationX: (i, target) => target.dataset.rx || 0,
                rotationY: (i, target) => target.dataset.ry || 0,
                z: (i, target) => target.dataset.z || 0,
                duration: 1.5,
            }
                , "+=2") // 2 saniye beklemeden sonra başla

            // 3. SCROLLTRIGGER ile Döndürme
            .to(cubeRef.current, {
                rotationX: 360,
                rotationY: 360,
                duration: 1,
                scrollTrigger: {
                    trigger: scene,
                    start: "top top", // Sahne ortadayken başla 
                    end: "bottom bottom", // Sahne tamamen çıkana kadar devam et
                    scrub: true,
                }
            }, "+=0"); // Önceki animasyonla çakışma süresi

    }, { scope: sceneRef });


    return (
        <div ref={containerRef} className="w-screen h-[400vh] bg-gradient-to-b from-gray-100 to-gray-900">

            {typeof window !== 'undefined' && createPortal(
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999]">
                    <div className={styles.scene} >
                        <div className={styles.cube} ref={cubeRef}>
                            <div className={styles.face} data-z="150">Ön</div>
                            <div className={styles.face} data-z="-150" data-ry="0">Arka</div>
                            <div className={styles.face} data-z="0" data-x="150" data-ry="90" >Sağ</div>
                            <div className={styles.face} data-z="0" data-x="-150" data-ry="-90" >Sol</div>
                            <div className={styles.face} data-z="0" data-y="150" data-rx="90" >Üst</div>
                            <div className={styles.face} data-z="0" data-y="-150" data-rx="-90" >Alt</div>
                        </div>
                    </div>
                </div>
                , document.body
            )}


            <div ref={sceneRef}>
                <section style={{ height: '450vh', padding: '50px', color: 'white' }}>
                    <h2 className="text-4xl font-bold mb-4">Blog Sayfası</h2>
                    <p className="text-lg">
                        Bu, 3D küp animasyonunun altında yer alan blog sayfasıdır. Aşağı kaydırdıkça küp dönecektir.
                    </p>
                </section>
            </div>

        </div>
    );
};

export default BlogPage;