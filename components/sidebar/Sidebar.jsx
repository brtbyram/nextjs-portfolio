"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import "./sidebar.css"
import Link from 'next/link'
import { usePathname } from "next/navigation";

function Sidebar() {

    const sidebarRef = useRef(null);
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false)


    useEffect(() => {
        const handleScroll = () => {
            if (sidebarRef.current) {
                sidebarRef.current.style.setProperty('--scroll-y', `${window.scrollY}px`);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <>
            <button  onClick={() => setIsOpen(!isOpen)} className={`sidebar-button fixed top-10 right-10 z-[1200] flex flex-col justify-center items-center rounded-full w-24 h-24   ${isOpen ? "bg-[#455ce9]" : "space-y-[6px] bg-black"}`}>
                <div className={`w-7 h-[1px] bg-white transition-transform duration-700 ${isOpen ? "rotate-[45deg]" : ""}`} />
                <div className={`w-7 h-[1px] bg-white transition-transform duration-700 ${isOpen ? "-rotate-[45deg]" : ""}`} />
            </button>



            <div
                className={`fixed-nav ${isOpen ? 'open-sidebar' : 'close-sidebar'}`}>
                <h5 className=''>NAVIGATION</h5>
                <div className='sidebar-line'></div>

                <motion.ul
                    initial={{ x: '100%' }}
                    animate={{ x: isOpen ? '0%' : '100%', transition: { duration: 0.8, ease: [.7, 0, .2, 1] } }}
                    className='page-nav'
                >
                    <li className='py-2'>
                        <Link href='/'>Home</Link>
                    </li>
                    <li className='py-2'>
                        <Link href='/projects'>Work</Link>
                    </li>
                    <li className='py-2'>
                        <Link href='/resume'>About</Link>
                    </li>
                    <li className='py-2'>
                        <Link href='/contact'>Contact</Link>
                    </li>
                </motion.ul>

                <div className='sidebar-line sm:hidden'></div>
                <h5>SOCIALS</h5>

                <motion.ul
                    initial={{ x: '100%' }}
                    animate={{ x: isOpen ? '0%' : '100%', transition: { duration: 1, ease: [.7, 0, .2, 1] } }}
                    className='social-nav'
                >
                    <li className='py-2'>
                        <Link href='https://www.linkedin.com/in/beratmurathanbayram/' target='_blank'>LinkedIn</Link>
                    </li>
                    <li className='py-2'>
                        <Link href='https://github.com/brtbyram' target='_blank'>GitHub</Link>
                    </li>
                    <li className='py-2'>
                        <Link href='https://dribbble.com/brtbyram' target='_blank'>Dribbble</Link>
                    </li>
                    <li className='py-2'>
                        <Link href='https://www.instagram.com/brtbyram/' target='_blank'>Instagram</Link>
                    </li>
                </motion.ul>

            </div>


        </>
    )
}

export default Sidebar