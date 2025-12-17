"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { usePathname } from "next/navigation"
import clsx from 'clsx'
import { gsap } from 'gsap'
import { useGSAP } from "@gsap/react"
import DrawSVGPlugin from "gsap/DrawSVGPlugin"
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TransitionLink } from '../TransitionLink'

// Pluginleri kaydettiğinden emin ol
if (typeof window !== "undefined") {
    gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger)
}

const NAVIGATION_LINKS = [
    { href: '/', label: 'home' },
    { href: '/work', label: 'work' },
    { href: '/about', label: 'about' },
    { href: '/contact', label: 'contact' }
]

const SOCIAL_LINKS = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/beratmurathanbayram/' },
    { name: 'GitHub', url: 'https://github.com/brtbyram' },
    { name: 'Dribbble', url: 'https://dribbble.com/brtbyram' },
    { name: 'Instagram', url: 'https://www.instagram.com/brtbyram/' }
]

function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Refs
    const sidebarRef = useRef(null)
    const burgerRef = useRef(null)
    const tlRef = useRef(null)

    // Hydration fix. 
    useEffect(() => {
        setMounted(true)
    }, [])

    // Scroll Logic
    useGSAP(() => {
        ScrollTrigger.create({
            start: "top -80",
            end: 99999,
            toggleClass: { targets: "body", className: "scrolled" }
        })
    }, [])

    // --- ANA ANIMASYON MANTIĞI ---
    useGSAP(() => {
        // Eğer portal henüz mount olmadıysa veya ref'ler yoksa çalışma
        if (!mounted || !sidebarRef.current || !burgerRef.current) return;

        // Context oluştur (Scope vermiyoruz çünkü Portal DOM yapısını değiştiriyor)
        const ctx = gsap.context(() => {
            
            // 1. Başlangıç Değerleri (Reset)
            gsap.set(".buns", { drawSVG: "0% 30%" });
            gsap.set(".letters", { drawSVG: "53.5% 100%", x: -155 });
            gsap.set(".patty", { drawSVG: "100% 0%", opacity: 1 }); // Patty görünür başlasın
            
            // Sidebar Başlangıç
            gsap.set(sidebarRef.current, { 
                clipPath: "ellipse(0% 50% at 100% 50%)",
                visibility: "hidden" // autoAlpha yerine visibility kullandık, set ile
            });
            
            // Linkler Başlangıç
            const navItems = sidebarRef.current.querySelectorAll(".nav-item");
            const socialItems = sidebarRef.current.querySelectorAll(".social-item");
            const backdrop = document.querySelector(".sidebar-backdrop");
            
            gsap.set([navItems, socialItems], { x: 50, opacity: 0 });
            gsap.set(backdrop, { opacity: 0, visibility: "hidden" });

            // 2. Timeline Oluştur
            tlRef.current = gsap.timeline({ 
                paused: true,
                defaults: { ease: "power3.inOut" },
                onStart: () => {
                    // Animasyon başlarken görünür yap
                    gsap.set(sidebarRef.current, { visibility: "visible" });
                    gsap.set(backdrop, { visibility: "visible" });
                },
                onReverseComplete: () => {
                    // Kapanınca gizle (mouse eventlerini engellemek için)
                    gsap.set(sidebarRef.current, { visibility: "hidden" });
                    gsap.set(backdrop, { visibility: "hidden" });
                }
            });

            tlRef.current
                // Burger Dönüşümü
                .to(".patty", { duration: 0.35, drawSVG: "50% 50%" }, 0)
                .to(".patty", { duration: 0.1, opacity: 0, ease: "none" }, 0.25)
                .to(".buns", { duration: 0.85, drawSVG: "69% 96.5%" }, 0)
                .to(".letters", { duration: 0.85, drawSVG: "0% 53%", x: 0 }, 0)

                // Sidebar Açılışı
                .to(backdrop, { opacity: 1, duration: 0.3 }, 0)
                .to(sidebarRef.current, { 
                    clipPath: "ellipse(100% 180% at 50% 50%)", 
                    duration: 1,
                    ease: "power4.inOut"
                }, 0.1)

                // Linklerin Gelişi
                .to(navItems, {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out"
                }, 0.2)
                .to(socialItems, {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: "power2.out"
                }, 0.2);

        }); // Scope yok, global seçim veya ref bazlı seçim yaptık

        return () => ctx.revert();

    }, [mounted]); // ÖNEMLİ: mounted değişince (Portal oluşunca) bu hook çalışsın!

    // Toggle Logic
    useEffect(() => {
        if (tlRef.current) {
            if (isOpen) {
                tlRef.current.play();
                document.body.style.overflow = 'hidden';
            } else {
                tlRef.current.reverse();
                document.body.style.overflow = '';
            }
        }
    }, [isOpen]);

    return (
        <>
            {/* Burger Button */}
            <button
                ref={burgerRef}
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "burger-button z-[1300] fixed top-8 right-8",
                    "flex items-center justify-center h-24 w-24 p-2 rounded-full",
                    "bg-[#1c1d20] border border-[#989799] shadow-lg transition-colors duration-300",
                    "hover:bg-[#455ce9] hover:text-white hover:border-white",
                    { 'bg-[#455ce9] text-white border-white': isOpen }
                )}
            >
                <svg id="theBurger" width="50" height="50" viewBox="0 0 200 120" className="cursor-pointer">
                    <g id="burger" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="10">
                        <line className="patty" x1="50" y1="61" x2="150" y2="61" />
                        <path className="buns" d="M50,29h96c27,0,48-1,34,40-18.12,53.08-48.64,23.86-48.64,23.86L60.64,22.14" />
                        <path className="buns" d="M50,94h96c27,0,48,1,34-40C161.88,1,131.36,30.17,131.36,30.17L60.64,100.88" />
                    </g>
                </svg>
            </button>

            {/* PORTAL */}
            {mounted && createPortal(
                <>
                    {/* Backdrop: Classname ekledik ki GSAP ile seçebilelim */}
                    <div 
                        className="sidebar-backdrop fixed inset-0 bg-black/50 z-[1290]" 
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar */}
                    <aside
                        ref={sidebarRef}
                        className={clsx(
                            "fixed top-0 right-0 z-[1299]",
                            "h-screen w-full sm:w-[630px] sm:max-w-[100vw]",
                            "bg-[#1c1d20] overflow-hidden overflow-y-auto",
                            "px-[5vw] sm:px-[120px] pt-[140px] pb-[140px]",
                            "flex flex-col justify-around"
                            // invisible class'ını kaldırdık!
                        )}
                    >
                        {/* Navigation */}
                        <div className="flex-grow flex flex-col">
                            <h5 className="pt-2.5 text-[#f3f3f3] opacity-50 text-[0.7rem] font-normal tracking-wide">NAVIGATION</h5>
                            <div className="w-full h-px bg-white/20 mt-5 mb-0" />
                            
                            <nav className="mt-5 flex-grow">
                                <ul className="flex flex-col justify-start items-start mt-4 text-[clamp(3rem,4vw,4rem)] leading-normal">
                                    {NAVIGATION_LINKS.map((link) => (
                                        <li key={link.href} className="nav-item w-full text-[#f3f3f3] hover:text-[#6d6d6d] " onClick={() => setIsOpen(false)}>
                                            <TransitionLink href={link.href} className='capitalize'>
                                                {link.label}
                                            </TransitionLink>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>

                        {/* Socials */}
                        <div className="mt-auto">
                            <div className="w-full h-px bg-white/20 mt-5 mb-5 sm:hidden" />
                            <h5 className="pt-2.5 text-[#f3f3f3] opacity-50 text-[0.7rem] font-normal tracking-wide">SOCIALS</h5>
                            <nav className="mt-5">
                                <ul className="flex flex-row gap-5 flex-wrap">
                                    {SOCIAL_LINKS.map((social) => (
                                        <li key={social.name} className="social-item">
                                            <Link 
                                                href={social.url} target="_blank" 
                                                className="block py-2 capitalize text-[#f3f3f3] text-base hover:text-[#6d6d6d] transition-colors"
                                            >
                                                {social.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </aside>
                </>,
                document.body
            )}
        </>
    )
}

export default Sidebar;