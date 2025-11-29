"use client";

import React from 'react'
import { BsArrowDownRight } from 'react-icons/bs'
import { motion } from 'framer-motion';
import Link from 'next/link';


const services = [
    {
        id: 1,
        title: 'Web Development',
        description: 'I have experience building websites and web applications using JavaScript, React, HTML, CSS, and more.',
        href: '/services/web-development'
    },
    {
        id: 2,
        title: 'Mobile Development',
        description: "I develop mobile applications using React Native, and I'm familiar with both Android and iOS platforms.",
        href: '/services/mobile-development'
    },
    {
        id: 3,
        title: 'UI/UX Design',
        description: 'I have an eye for design and I am familiar with tools like Figma, Adobe XD, and Sketch.',
        href: '/services/ui-ux-design'
    },
    {
        id: 4,
        title: 'Backend Development',
        description: 'I have experience with Node.js and databases like MongoDB, MySQL, and PostgreSQL.',
        href: '/services/backend-development'
    }
]

function Services() {
    return (
        <section className='min-h-[80vh] flex flex-col justify-center py-12 xl:yp-0'>
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.4, delay: 2.4, ease: 'easeIn' } }}
                    className='grid grid-cols-1 md:grid-cols-2 gap-14'
                >
                    {
                        services.map((service, index) => {
                            return (
                                <div key={index} className='flex flex-1 flex-col justify-center gap-6 group'>
                                    { /* top */}
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover transition-all duration-500 '>{service.id}</div>
                                        <Link href={service.href} className='w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45'>
                                            <BsArrowDownRight className='text-primary text-3xl'/>
                                        </Link>
                                    </div>
                                    { /* title */}
                                    <h2 className='text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500'>{service.title}</h2>
                                    { /* description */}
                                    <p className='text-white/60'>{service.description}</p>
                                    { /* border */}
                                    <div className='border-b border-white/20 w-full'/>
                                </div>
                            )
                        })
                    }
                </motion.div>
            </div>
        </section>
    )
}

export default Services