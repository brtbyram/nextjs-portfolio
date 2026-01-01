"use client";

import React, { use } from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "./work.css";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import BackgroundShader from "@/components/BackgroundShader";



gsap.registerPlugin(DrawSVGPlugin);

function Work() {
  const componentRef = useRef(null);
  const textRef = useRef(null);
  const textContainer = useRef(null);

  function getMousePos(e, element) {
    const rect = element.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function splitText(element) {
    const text = element.innerText;
    element.innerHTML = "";

    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.innerText = char === " " ? "\u00A0" : char;
      span.className = "char";
      element.appendChild(span);
    });
  }

  useEffect(() => {
    splitText(textRef.current);
  }, []);

  function scatter(e) {
    const letters = textRef.current.querySelectorAll(".char");
    const parentRect = textRef.current.getBoundingClientRect();

    const mouseX = e.clientX - parentRect.left;
    const mouseY = e.clientY - parentRect.top;

    const RADIUS = 40;

    letters.forEach((char) => {
      const rect = char.getBoundingClientRect();

      const cx = rect.left - parentRect.left + rect.width / 2;
      const cy = rect.top - parentRect.top + rect.height / 2;

      const dx = cx - mouseX;
      const dy = cy - mouseY;

      const distance = Math.hypot(dx, dy);

      // ❌ Etki alanı dışı
      if (distance > RADIUS) return;

      const strength = 1 - distance / RADIUS;

      const angle = Math.atan2(dy, dx);

      gsap.to(char, {
        x: Math.cos(angle) * 80 * strength,
        y: Math.sin(angle) * 80 * strength,
        rotation: gsap.utils.random(-90, 90) * strength,
        opacity: 1 - strength * 0.7,
        duration: 0.4,
        ease: "power3.out",
      });
    });
  }

  function reset() {
    const letters = textRef.current.querySelectorAll(".char");

    gsap.to(letters, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
    });
  }





  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(".parallax-layer");

      window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        elements.forEach((el, index) => {
          const speed = gsap.utils.clamp(0.1, 0.9, index * 0.2); // Hızı katman indeksine göre ayarla
          const y = gsap.utils.mapRange(0, document.body.scrollHeight, 0, -500, scrollY) * speed; // Kaydırma mesafesini harita
          // kaydırdıkça elementlerin border radius'ini değiştir
          const borderRadius = gsap.utils.mapRange(0, document.body.scrollHeight, 0, 900 * 40 * speed, scrollY) * speed;

          gsap.to(el, { y, borderRadius, duration: 0.5, ease: "none" });
        });
      });
    }, componentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={componentRef}>

      <section className="h-screen overflow-hidden relative bg-[#76b6e4]">
        <div className="parallax-layer absolute top-0 left-0 w-full h-full bg-[#5a0e27] flex items-center justify-center">
          <h1 className="text-white text-5xl">Layer 1</h1>
        </div>
        <div className="parallax-layer absolute top-0 left-0 w-full h-full bg-[#76b6e4] flex items-center justify-center">
          <h1 className="text-white text-5xl">Layer 2</h1>
        </div>
        <div className="parallax-layer absolute top-0 left-0 w-full h-full bg-[#5a0e27] flex items-center justify-center">
          <h1 className="text-white text-5xl">Layer 3</h1>
        </div>
      </section>

      <section className="h-screen w-screen flex items-center justify-center bg-[#e4a076] text-4xl font-bold">
        <h1
          ref={textRef}
          onMouseEnter={scatter}
          onMouseLeave={reset}
        >
          HELLO WORLD
        </h1>
      </section>


      <section className="h-screen w-screen flex items-center justify-center bg-white text-black">
        <div ref={textContainer} id="textContainer">
          hellooo
        </div>
      </section>


    </div>
  );
}

export default Work;
