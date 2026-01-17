// components/UI/Cursor.tsx
"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCursor } from "../../lib/context/CursorContext";

const Cursor = () => {
  const { variant, cursorText } = useCursor();
  const cursorRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // 1. Setup GSAP quickTo for Performance (React render loop'a girmez)
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3" });

    // 2. Mouse Move Event
    const moveShape = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", moveShape);

    return () => {
      window.removeEventListener("mousemove", moveShape);
    };
  }, []);

  // 3. Variant Animations (Duruma göre şekil değiştirme)
  useEffect(() => {
    const cursor = cursorRef.current;
    const text = textRef.current;
    if (!cursor) return;

    if (variant === "default") {
      // Normal küçük nokta
      gsap.to(cursor, {
        width: 16,
        height: 16,
        backgroundColor: "white",
        mixBlendMode: "difference", // Maskeleme efekti için kilit nokta
        duration: 0.5,
        ease: "power2.out",
      });
      if (text) gsap.to(text, { opacity: 0, duration: 0.2 });
    } else if (variant === "text") {
      // İçinde yazı olan büyük yuvarlak
      gsap.to(cursor, {
        width: 120,
        height: 120,
        backgroundColor: "white",
        mixBlendMode: "difference",
        duration: 0.4,
        ease: "back.out(1.7)", // Hafif elastik efekt
      });
      if (text) gsap.to(text, { opacity: 1, delay: 0.1, duration: 0.2 });
    } else if (variant === "mask") {
      // Maskeleme alanına girince cursor'ı biraz büyüt ama şeffaf yap
      // Böylece kullanıcı maskenin nerede olduğunu hisseder ama yazıyı kapatmaz
      gsap.to(cursor, {
        width: 0, // Maske boyutuyla yaklaşık aynı olsun
        height: 0,
        backgroundColor: "transparent",
        mixBlendMode: "normal",
        duration: 0.3,
      });
      if (text) gsap.to(text, { opacity: 0, duration: 0.2 });
    }
  }, [variant]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        transform: "translate(-50%, -50%)", // Başlangıçta tam ortalamak için
      }}
    >
      <span
        ref={textRef}
        className="text-black text-[14px] font-bold opacity-0 whitespace-nowrap uppercase tracking-wider"
      >
        {cursorText}
      </span>
    </div>
  );
};

export default Cursor;