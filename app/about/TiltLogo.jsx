"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LogoTilt() {
    const mainRef = useRef(null);
    const outerRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        const main = mainRef.current;
        const outer = outerRef.current;
        const inner = innerRef.current;
        const eye = inner.querySelector(".eye");


        if (!main || !outer || !inner) return;

        // 3D sahne
        gsap.set(main, { perspective: 650 });

        // Performanslı setter'lar
        const outerRX = gsap.quickTo(outer, "rotationX", { ease: "power3" });
        const outerRY = gsap.quickTo(outer, "rotationY", { ease: "power3" });
        const innerX = gsap.quickTo(inner, "x", { ease: "power3" });
        const innerY = gsap.quickTo(inner, "y", { ease: "power3" });
        const eyeX = gsap.quickTo(eye, "x", { ease: "power3" });
        const eyeY = gsap.quickTo(eye, "y", { ease: "power3" });


        const handleMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;


            outerRX(gsap.utils.interpolate(15, -15, y));
            outerRY(gsap.utils.interpolate(-15, 15, x));


            innerX(gsap.utils.interpolate(-30, 30, x));
            innerY(gsap.utils.interpolate(-30, 30, y));

            eyeX(gsap.utils.interpolate(-5, 5, x));
            eyeY(gsap.utils.interpolate(-5, 5, y));
        };

        const handleLeave = () => {
            outerRX(0);
            outerRY(0);
            innerX(0);
            innerY(0);
            eyeX(0);
            eyeY(0);
        };

        main.addEventListener("pointermove", handleMove);
        main.addEventListener("pointerleave", handleLeave);

        return () => {
            main.removeEventListener("pointermove", handleMove);
            main.removeEventListener("pointerleave", handleLeave);
        };
    }, []);

    return (
        <main
            ref={mainRef}
            className="w-full h-screen flex items-center justify-center"
        >
            <div
                ref={outerRef}
                className="logo-outer bg-neutral-800 w-80 h-64 flex items-center justify-center rounded-full shadow-lg"
            >
                <div ref={innerRef} className="logo w-64 h-48 bg-black rounded-full flex flex-col justify-center items-center px-2 gap-y-4 text-white text-2xl font-bold">
                    <div className="flex">
                        <div className="h-24 w-24 rounded-full bg-white">
                            <div className="eye h-16 w-16 rounded-full bg-black"></div>
                        </div>
                        <div className="h-24 w-24 rounded-full bg-white">
                            <div className="eye h-16 w-16 rounded-full bg-black my-auto mx-auto"></div>
                        </div>
                    </div>
                    <div className="w-32 h-2 bg-white"></div>
                </div>
            </div>
        </main>
    );
}