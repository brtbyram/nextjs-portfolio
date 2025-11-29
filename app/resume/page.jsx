"use client"
import "./resume.css"
import Image from 'next/image'
import { useEffect, useRef } from "react";

import LocomotiveScroll from "locomotive-scroll";





function Resume() {


  const scrollRef = useRef(null);

  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
  };


  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <>

      {/* <div className="no-scroll-overlay"></div>


      <div className="loading-container" >
        <div className="loading-screen">
          <div className="rounded-div-wrap top">
            <div className="rounded-div"></div>
          </div>
          <div className="loading-words">
            <h2 className="home-active home-active-first">Hello<div className="dot"></div></h2>
            <h2 className="home-active">Bonjour<div className="dot"></div></h2>
            <h2 className="home-active">स्वागत हे<div className="dot"></div></h2>
            <h2 className="home-active">Ciao<div className="dot"></div></h2>
            <h2 className="home-active">Olá<div className="dot"></div></h2>
            <h2 className="home-active jap">おい<div className="dot"></div></h2>
            <h2 className="home-active">Hallå<div className="dot"></div></h2>
            <h2 className="home-active">Guten tag<div className="dot"></div></h2>
            <h2 className="home-active-last">Hallo<div className="dot"></div></h2>
            <h2 className="active">Home<div className="dot"></div></h2>
            <h2>Work<div className="dot"></div></h2>
            <h2>TWICE<div className="dot"></div></h2>
            <h2>The Damai<div className="dot"></div></h2>
            <h2>FABRIC™<div className="dot"></div></h2>
            <h2>Aanstekelijk<div className="dot"></div></h2>
            <h2>Base Create<div className="dot"></div></h2>
            <h2>AVVR<div className="dot"></div></h2>
            <h2>GraphicHunters<div className="dot"></div></h2>
            <h2>Future Goals<div className="dot"></div></h2>
            <h2>Atypikal<div className="dot"></div></h2>
            <h2>One:Nil<div className="dot"></div></h2>
            <h2>Andy Hardy<div className="dot"></div></h2>
            <h2>About<div className="dot"></div></h2>
            <h2>Contact<div className="dot"></div></h2>
            <h2>Success<div className="dot"></div></h2>
            <h2>Archive<div className="dot"></div></h2>
            <h2>Error<div className="dot"></div></h2>
            <h2>Styleguide<div className="dot"></div></h2>
          </div>
          <div className="rounded-div-wrap bottom">
            <div className="rounded-div"></div>
          </div>
        </div>
      </div> */}

      <section className='home-header h-screen sm:min-h-[115vh] bg-[#a0a0a0] relative flex justify-center items-center overflow-hidden'
        ref={scrollRef}
        data-container
        data-scroll
      >
        <Image
          data-scroll
          data-scroll-speed="-.1"
          src="/assets/my-photo2.png"
          alt="Resume"
          width={900}
          height={1400}
          className="absolute bottom-24 sm:bottom-0 max-sm:scale-150 overflow-hidden"
        />

        <div className="big-name" >
          <div className="name-h1" data-scroll data-scroll-to data-scroll-direction="horizontal" data-scroll-speed=".2" data-scroll-position="top">
            <div className="name-wrap">
              <h1 className="once-in">
                <span className="spacer">—</span>Berat Murathan Bayram
              </h1>
            </div>
            <div className="name-wrap">
              <h1 className="once-in">
                <span className="spacer">—</span>Berat Murathan Bayram
              </h1>
            </div>
          </div>
        </div>

        

        <div>
          <h4 className="absolute max-sm:bottom-0 right-24 text-start">Freelance <br />
            Designer & Developer</h4>
        </div>

      </section>

      <section className="h-screen w-full bg-white">
        <div className="flex justify-center items-center h-full">
          <h1 className="text-4xl font-bold text-black">Resume</h1>
        </div>
      </section>


      <div id="scroll-container" ref={scrollRef} data-scroll-container data-scroll-css-progress>
        <div data-scroll-section className="grid grid-cols-3">
          <section
            data-scroll
            data-scroll-speed=".5"
            className="h-[100vh] bg-blue-500 text-white text-4xl"
          >
            Bölüm 1 - Yavaş Kayar
          </section>
          <section
            data-scroll
            data-scroll-css-progress
            data-scroll-speed="-.2"
            className="h-[100vh] bg-red-500 text-white text-4xl"
          >
            Bölüm 2 - Daha yavaş Kayar
          </section>
          <section
            data-scroll
            data-scroll-css-progress
            data-scroll-speed="1"
            className="h-[100vh] bg-green-500 text-white text-4xl"
          >
            Bölüm 3 - Normal
          </section>
        </div>
      </div>



      <div className='path' />


      <svg width="0" height="0">
        <defs>
          <clipPath id="clip-shape" clipPathUnits="objectBoundingBox">
            <path d="M 0.5 0 C 0.33 0.33, 0.33 0.66, 0.5 1 L 1 1 L 1 0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div class="responsive-box"></div>


      <button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        className="relative m-40 overflow-hidden px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium transition duration-300 ease-in-out ripple-button"
      >
        Dalga Butonu
      </button>
    </>
  )
}

export default Resume