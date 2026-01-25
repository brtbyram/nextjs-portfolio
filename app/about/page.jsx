"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LogoTilt from "./TiltLogo";
import GsapDeneme from "./GsapDeneme";
import { Grid } from "lucide-react";
import GridStagger from "./GsapDeneme";

gsap.registerPlugin(ScrollTrigger);

function AboutPage() {
    const containerRef = useRef(null);

    useGSAP(() => {

        const hero = ".about-hero";
        const word1 = ".word-1";
        const word2 = ".word-2";
        const box = ".box";


        gsap.fromTo(box, {
            clipPath: "ellipse(100% 100% at 50% 50%)",
            translateY: 0,
            backgroundColor: "#ffffff"
        }, {
            clipPath: "ellipse(100% 70% at 50% 50%)",
            backgroundColor: "#000000",
            translateY: 100,
            duration: 1,
            scrollTrigger: {
                trigger: box,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // --- HESAPLAMA KISMI ---
        // İkinci kelimenin, birinci kelimenin yanına gelmesi için
        // ne kadar sola gitmesi gerektiğini hesaplayan fonksiyon.
        const getInitialOffset = () => {
            const containerWidth = document.querySelector(hero).offsetWidth;
            const w1Width = document.querySelector(word1).offsetWidth;
            const w2Width = document.querySelector(word2).offsetWidth;

            // Konteynerden iki kelimenin genişliğini çıkarırsak aradaki boşluğu buluruz.
            // gap-4 verdiğimiz için (16px) onu da hesaba katıp düşüyoruz ki tam yapışmasın.
            // 16px (1rem) yaklaşık gap payı.

            return -(containerWidth - w1Width - w2Width);
        };

        // --- TIMELINE (SIRALI ANİMASYON) ---
        // delay yok! Her şey sırayla çalışacak.
        const tl = gsap.timeline({ defaults: { opacity: 1, ease: "expo.inOut", duration: 0.6, stagger: 0.2 } });


        tl.set([word1, word2], { y: 300, opacity: 0, delay: 1.1 });
        tl.set(word2, { x: () => getInitialOffset() });

        tl.to([word1, word2], {
            y: 0
        }).to(word2, {
            x: 0
        });


    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen w-screen overflow-x-hidden bg-neutral-100">

            <section className="hero-container h-96 flex items-center overflow-hidden px-4 md:px-8 bg-gray-100 border-b border-gray-300">


                <div className="about-hero w-full flex justify-between max-md:flex-col text-[16vw] md:text-[12vw] text-black font-semibold tracking-tighter">
                    <div className="word-1 leading-none">
                        NOCH
                    </div>
                    <div className="word-2 leading-none text-right">
                        FRAGEN?
                    </div>
                </div>

            </section>

            <section style={{
                background: "radial-gradient(70.77% 70.77% at 0% 70.77%, #ffd9b0 0%, #fd9f3b 80.73%, #ff8709 100%);"
            }} className="h-[100vh]  flex items-center justify-center">

            </section>


            <section className="h-[100vh] flex items-center justify-center">
                <LogoTilt/>
            </section>

            <section className="min-h-screen bg-neutral-900">
                <GridStagger/>
            </section>
        </div>
    );
}

export default AboutPage;