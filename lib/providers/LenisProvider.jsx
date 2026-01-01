"use client";

import Lenis from 'lenis';
import { useEffect } from "react";

export default function LenisProvider({ children }) {

    const isMobile = typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent); // Basit bir mobil cihaz kontrolü 

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: !isMobile,
            smoothTouch: false, // mobil cihazlarda dokunma kaydırmayı devre dışı bırak
            touchMultiplier: 2, 
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return children;
}