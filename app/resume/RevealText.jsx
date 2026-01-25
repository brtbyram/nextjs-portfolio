// components/UI/RevealText.tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react"; // 1. useGSAP importu
import { useCursor } from "@/lib/context/CursorContext";


const RevealText = ({ initialText, revealText, children, className }) => {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const { setVariant } = useCursor();

  useGSAP(() => {
    // Başlangıç değerlerini set edebiliriz (Opsiyonel, CSS'de de verilebilir)
    gsap.set(containerRef.current, { "--r": "0px" });
  }, { scope: containerRef });

  // 3. Mouse Hareketi (En performanslı yöntem: CSS Variable güncelleme)
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // React render döngüsüne girmeden doğrudan DOM'a yazıyoruz
    containerRef.current.style.setProperty("--x", `${x}px`);
    containerRef.current.style.setProperty("--y", `${y}px`);
  };

  // 4. Animasyon Fonksiyonları (Context Safe kullanmaya gerek yok, basit eventler yeterli)
  const handleMouseEnter = () => {
    setVariant("mask");
    // CSS variable'ı animate ediyoruz
gsap.fromTo(containerRef.current, 
  { "--r": "0px" },
  { "--r": "120px", duration: 0.4, ease: "power2.out" }
);
  };

  const handleMouseLeave = () => {
    setVariant("default");
    gsap.to(containerRef.current, {
      "--r": "0px",
      duration: 0.3,
      ease: "power2.in",
    });
  };

  return (

    <div className={`${className}`}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`h-full w-full cursor-none select-none ` }
        style={{ "--x": "0px", "--y": "0px", "--r": "0px" }}>

        <div
          ref={maskRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          >
          {initialText}
        </div>

        <div
          className="absolute top-0 left-0 w-full h-full bg-black pointer-events-none"
          style={{
            clipPath: "circle(var(--r) at var(--x) var(--y))",
            willChange: "clip-path"
          }}>

          <div>
            {revealText}
          </div>
          
        </div>
      </div>
      {children}
    </div>
  );

};



export default RevealText;

