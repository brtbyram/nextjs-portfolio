"use client"

import MagneticButton from '@/components/animate/MagneticButton'
import { useRef, useState } from 'react'
import "./contact.css"
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link'
import { Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react'
import MaskCursor from '@/components/MaskCursor'
import RevealText from '../resume/RevealText'
import { useCursor } from '@/lib/context/CursorContext'
import TextInput from '@/components/ui/TextInput'

gsap.registerPlugin(ScrollTrigger);



function Contact() {

  const [contactForm, setContactForm] = useState({
    name: '',
    interestedIn: [],
    email: '',
    message: ''
  });

  const contactRef = useRef(null);

  const { variant } = useCursor()

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
    <div ref={contactRef} className='bg-neutral-100 min-h-screen w-screen'>

      <section className='h-screen w-screen'>
        <RevealText
          className="w-full h-full relative"
          initialText={<span className="text-[#2B2F31] absolute  top-[25%] md:top-[15%] left-4 md:left-[20%] sm:font-semibold tracking-[-0.02em] text-6xl lg:text-7xl xl:text-9xl w-[90%] max-w-[950px]"><span className="font-semibold md:font-extrabold">Hey!</span> Tell us all the things</span>}
          revealText={<span className="text-neutral-100 absolute top-[25%] md:top-[15%] left-4 md:left-[20%] sm:font-semibold tracking-[-0.02em] text-6xl lg:text-7xl xl:text-9xl w-[90%] max-w-[950px]" >And We will get in touch</span>}
        >
          <div className="contact-informations  absolute top-[50%] left-4 md:left-[20%] space-y-8" >
            <div className='text-white mix-blend-difference font-semibold space-y-8 '>
              <div className="contact-address text-xl tracking-tight">Osman Dilek Cd. Kardeş sok. no:1/A<br />
                Beşikdüzü - Trabzon
              </div>
              <div className="contact-meta text-sm md:text-base space-y-2">
                <div className="flex items-center hoverable-sm">
                  <Mail className="meta-icon mr-2" size={20} />
                  <div className="meta-data pl-2 border-l p-1 "><Link href="mailto:contact@bemubastudio.com">contact@bemubastudio.com</Link></div>
                </div>
                <div className="flex items-center space-x-1 hoverable-sm">
                  <Phone className="meta-icon mr-1" size={20} />
                  <div className="meta-data border-l p-1 "><Link href="tel:+90 534 927 5261">+90 534 927 5261</Link></div>
                </div>
              </div>
            </div>
          </div>

        </RevealText>
      </section>

      <div className='flex flex-col space-y-4 text-black pointer-events-auto -translate-y-60 w-[40vw] mx-auto'>
        <div className='text-neutral-300 text-2xl '> Im interested in...</div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-md '>
          {["Site from strach", "App from strach", "UX/UI design", "Branding", "Animation 2D", "Animation 3D", "Illustration", "Motion Graphics"].map((item, index) => (<div
            onClick={
              () => {
                if (contactForm.interestedIn.includes(item)) {
                  setContactForm({
                    ...contactForm,
                    interestedIn: contactForm.interestedIn.filter(i => i !== item)
                  });
                } else {
                  setContactForm({
                    ...contactForm,
                    interestedIn: [...contactForm.interestedIn, item]
                  });
                }
              }
            }
            key={index}
            className={contactForm.interestedIn.includes(item) ? 'border rounded-full p-3 px-5 text-center bg-black text-white transition-all' : 'border rounded-full p-3 px-5 text-center hover:bg-neutral-600 hover:text-neutral-200'}>{item}</div>))}
        </div>

        <section className='flex flex-col space-y-4'>

          <TextInput
            label="Your name"
            value={contactForm.name}
            onChange={(e) => {
              setContactForm({ ...contactForm, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: "" }); // Yazarken hatayı temizle
            }}
          />

          <TextInput
            label="Your email"
            type="email"
            value={contactForm.email}
            onChange={(e) => {
              setContactForm({ ...contactForm, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: "" }); // Yazarken hatayı temizle
            }}
          />

          <TextInput
            label="Text us about your project"
            type="textarea"
            value={contactForm.message}
            onChange={(e) => {
              setContactForm({ ...contactForm, message: e.target.value });
              if (errors.message) setErrors({ ...errors, message: "" }); // Yazarken hatayı temizle
            }}
          />

        </section>
      </div>


      <div className='flex justify-end container -translate-y-48'>
        <div
          className="px-8 py-4 border border-black text-black bg-white font-semibold rounded-full hoverable-lg"
          onClick={() => {
            // Handle form submission logic here
            console.log(contactForm);
          }}
        >
          Send Message
        </div>
      </div>


    </div>
  )
}

export default Contact