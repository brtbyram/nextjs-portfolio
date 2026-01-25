"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCursor } from "@/lib/context/CursorContext";
import Lenis from "lenis";

const DualLayerLayout = ({ children, revealChildren }) => {
  const { maskSize } = useCursor();
  const overlayRef = useRef(null);
  
  const mouse = useRef({ x: 0, y: 0 }); // Mouse'un penceredeki yeri
  const scrollPos = useRef(0);         // Scroll miktarı
  const pos = useRef({ x: 0, y: 0 });   // Lerp edilen koordinat
  const currentR = useRef(8);
  const targetR = useRef(8);

  useEffect(() => {
    targetR.current = maskSize / 2;
  }, [maskSize]);

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  useGSAP(() => {
    const loop = () => {
      // ÖNEMLİ: Maske 'fixed' olduğu için pencereye göre (mouse.current.y) hareket etmeli.
      // Eğer maske 'absolute' olsaydı mouse.current.y + scrollPos.current yapmalıydık.
      // Ancak Reino gibi yapılarda maske sabit (fixed) durur, içerik altından kayar.
      
      pos.current.x += (mouse.current.x - pos.current.x) * 0.10;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.10;
      
      currentR.current += (targetR.current - currentR.current) * 0.08;

      if (overlayRef.current) {
        overlayRef.current.style.setProperty("--x", `${pos.current.x}px`);
        overlayRef.current.style.setProperty("--y", `${pos.current.y}px`);
        overlayRef.current.style.setProperty("--r", `${currentR.current}px`);
      }
    };

    const handleMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };


    const handleScroll = () => {
        scrollPos.current = window.scrollY || window.pageYOffset;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("scroll", handleScroll);
    gsap.ticker.add(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      gsap.ticker.remove(loop);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* ALT KATMAN */}
      <div className="relative z-0 bg-white text-black">
        {children}
      </div>

      {/* ÜST KATMAN (Maske) */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[50] pointer-events-none bg-black text-white select-none"
        style={{
          // Fixed olduğu için ekranın neresindeysen orada kalır
          clipPath: "circle(var(--r) at var(--x) var(--y))",
          willChange: "clip-path"
        }}
      >
        {/* İÇERİK: Fixed katman içinde scroll'u takip etmesi için 
            içerikteki div'in transformu sayfanın scroll'una zıt yönde hareket etmeli.
        */}
        <div 
          className="w-full h-full"
          style={{ 
             // ÖNEMLİ: Scroll yaptıkça maskenin içindeki içeriğin 
             // ana sayfa ile senkronize kalmasını sağlar.
             transform: `translateY(${-scrollPos.current}px)` 
          }}
        >
          {revealChildren}
        </div>
      </div>
    </div>
  );
};

export default DualLayerLayout;