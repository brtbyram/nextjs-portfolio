"use client"

import MagneticButton from '@/components/animate/MagneticButton'
import { useRef } from 'react'
import "./contact.css"
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);



function Contact() {

  const contactRef = useRef(null);

  useGSAP(() => {
    const heading = contactRef.current.querySelector('.heading');
    if (!heading) return;

    const letters = heading.textContent.split('');
    heading.textContent = '';

    letters.forEach((letter) => {
      const span = document.createElement('span');
      span.textContent = letter;
      heading.appendChild(span);
    });

    const spans = heading.querySelectorAll('span');

    gsap.fromTo(spans,
      {
        y: '100%',
        skewY: 20,
        opacity: 0
      },
      {
        y: '0%',
        skewY: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.2,
        delay: 1.5
      }
    );
  }, [contactRef]);



  return (
    <div ref={contactRef} className='min-h-screen  w-screen flex flex-col justify-center items-center bg-gray-200'>
      <MagneticButton className="magnetic-btn">
        <span className="magnetic-btn__text">Hover me</span>
      </MagneticButton>
      <h1 className='text-[30vw] heading leading-[1] uppercase font-bold my-0'>muro</h1>
    </div>
  )
}

export default Contact