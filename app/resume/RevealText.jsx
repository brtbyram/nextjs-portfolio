// components/UI/RevealText.tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react"; // 1. useGSAP importu
import { useCursor } from "@/lib/context/CursorContext";


const RevealText = ({ initialText, revealText, className = "" }) => {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const overlayRef = useRef(null);
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
    gsap.to(containerRef.current, {
      "--r": "200px", // Maske yarıçapı
      duration: 0.3,
      ease: "power2.out",
    });
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

    <div className={` ${className}`}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`relative h-full w-full overflow-hidden cursor-none select-none` }
        style={{ "--x": "0px", "--y": "0px", "--r": "0px" }}>

        <span
          ref={maskRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute">
          {initialText}
        </span>

        <div
          ref={overlayRef}
          className="absolute top-0 left-0 w-full h-full bg-black pointer-events-none"
          style={{
            clipPath: "circle(var(--r) at var(--x) var(--y))",
            willChange: "clip-path"
          }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-parent">
            {revealText}
          </span>
        </div>
      </div>
    </div>
  );

};



export default RevealText;

