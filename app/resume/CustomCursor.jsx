"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    // 1. Performans için gsap.quickTo kullanımı
    // Bu fonksiyonlar, fare her hareket ettiğinde yeni bir tween oluşturmaz,
    // doğrudan değeri günceller.
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3" });

    // 2. İmleci varsayılan olarak gizle ve ortala
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const moveCursor = (e) => {
      // Fare hareket ettiğinde görünür yap
      gsap.to(cursor, { opacity: 1, duration: 0.3, overwrite: "auto" });
      
      xTo(e.clientX);
      yTo(e.clientY);
    };


    
    // Hover Efektleri
    const handleMouseEnter = (e) => {
      // Class kontrolü yerine data attribute kullanmak daha esnektir
      // Hem .mask-target class'ını hem de data-hover="true" olanları yakalar
      const target = e.target.closest('.mask-target') || e.target.closest('[data-hover="true"]');
      
      if (target) {
        gsap.to(cursor, { 
          scale: 4, // 8 çok büyük olabilir, 4-5 daha dengelidir
          opacity: 1, // Opacity 0 yaparsan cursor kaybolur, difference modu için 1 kalmalı
          mixBlendMode: "difference", // Renklerin tersine dönmesi için
          duration: 0.3 
        });
      }
    };



    const handleMouseLeave = (e) => {
      const target = e.target.closest('.mask-target') || e.target.closest('[data-hover="true"]');
      
      if (target) {
        gsap.to(cursor, { 
          scale: 1, 
          opacity: 1,
          duration: 0.3 
        });
      }
    };
    
    // Sayfadan çıkınca imleci gizle
    const handleWindowLeave = () => {
        gsap.to(cursor, { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseEnter);
    window.addEventListener("mouseout", handleMouseLeave);
    document.addEventListener("mouseleave", handleWindowLeave); // Pencere dışına çıkış kontrolü

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseEnter);
      window.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("mouseleave", handleWindowLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 bg-white mix-blend-difference rounded-full pointer-events-none z-[9999]  will-change-transform"
      // Not: CSS ile translate kullanmıyoruz, GSAP xPercent/yPercent hallediyor.
    />
  );
};

export default CustomCursor;