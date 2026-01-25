"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const MaskContainer = ({ children, revealContent, className = "" }) => {
  const containerRef = useRef(null);
  const maskLayerRef = useRef(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const speed = 0.15;

  useGSAP(() => {
    const loop = () => {
      if (!maskLayerRef.current) return;

      // Lerp (Yumuşak Takip)
      pos.current.x += (mouse.current.x - pos.current.x) * speed;
      pos.current.y += (mouse.current.y - pos.current.y) * speed;

      // CSS Değişkenlerini Güncelle
      maskLayerRef.current.style.setProperty("--x", `${pos.current.x}px`);
      maskLayerRef.current.style.setProperty("--y", `${pos.current.y}px`);
    };

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);
    gsap.ticker.add(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(loop);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative grid grid-cols-1 grid-rows-1 overflow-hidden ${className}`}
    >
      {/* 1. KATMAN: ALT (Base) - Beyaz Zemin Siyah Yazı */}
      <div className="col-start-1 row-start-1 z-0 bg-white text-black">
        {children}
      </div>

      {/* 2. KATMAN: ÜST (Reveal) - Siyah Zemin Beyaz Yazı */}
      <div
        ref={maskLayerRef}
        className="col-start-1 row-start-1 z-10 bg-black text-white pointer-events-none"
        style={{
          "--x": "0px",
          "--y": "0px",
          "--r": "150px", // Daire boyutu
          clipPath: "circle(var(--r) at var(--x) var(--y))",
          willChange: "clip-path"
        }}
      >
        {revealContent}
      </div>
    </div>
  );
};

export default MaskContainer;