"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GridStagger() {
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.set(".box", {rotation: 0.5, force3D: true});

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".cell",
                {
                    scale: 0.04,
                    
                    y: 60,
                    z: -200
                },
                {
                 
                    scale: 1,
                   
                    y: 0,
                    z: 0,
                    duration: 1,
                    yoyo: true,
                    repeat: -1,
                    repeatDelay: 0.5,
                    stagger: {
                        ease: "power2.inOut",
                        grid: "auto",
                         amount: 1.5, 
                        from: "random",
                        each: 0.8,
                       
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="grid grid-cols-12 bg-black perspective-[1000px] w-screen h-screen"
        >
            {Array.from({ length: 144 }).map((_, i) => (
                <div
                    key={i}
                    className="cell size-full bg-white  text-white flex items-center justify-center font-bold hover:bg-white transition duration-300 "
                >

                </div>
            ))}
        </div>
    );
}