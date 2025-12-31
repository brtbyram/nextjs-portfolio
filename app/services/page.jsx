'use client';

import WaterRippleWrapper from '@/components/animate/WaterRippleWrapper';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// GSAP eklentilerini kaydet
gsap.registerPlugin(ScrollTrigger);

export default function Services() {
    const servicesRef = useRef(null);

    useGSAP(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".hero-scale",
                { scale: 1 },
                {
                    scale: 0.5,
                    ease: "none",
                    scrollTrigger: {
                        trigger: servicesRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: true,
                    }
                }
            );
            gsap.to(".hero-services", {
                backgroundColor: "#000000", ease: "none", scrollTrigger: {
                    trigger: servicesRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                }
            });
        }, servicesRef);

        return () => ctx.revert();
    });



    return (
        <div ref={servicesRef} className='min-h-screen w-full flex flex-col'>

            <section className="hero-services h-screen relative w-screen overflow-hidden">
                <WaterRippleWrapper quality={0.7}/>
            </section>

            <section className='min-h-screen w-full bg-white flex flex-col justify-center items-center p-8 gap-6'>
                <h1 className='text-4xl font-bold text-black mb-8'>Services</h1>
                <div className='max-w-3xl text-center space-y-4'>
                    {['Web Design', 'Web Development', 'UI/UX Design', 'Responsive Design', 'E-commerce Solutions'].map((service, index) => (
                        <p
                            key={index}
                            className='text-lg text-gray-700'
                        >
                            {service}
                        </p>
                    ))}
                </div>
            </section>

        </div>
    );
}