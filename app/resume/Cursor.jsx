"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCursor } from "@/lib/context/CursorContext";

const Cursor = () => {
  const { variant, cursorText } = useCursor();
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const circle = useRef({ x: 0, y: 0 });
  const speed = 0.10; 

  useGSAP(() => {
    const manageMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", manageMouseMove);
    const loop = () => {
      if (!cursorRef.current) return;
      circle.current.x += (mouse.current.x - circle.current.x) * speed;
      circle.current.y += (mouse.current.y - circle.current.y) * speed;
      gsap.set(cursorRef.current, { x: circle.current.x, y: circle.current.y, xPercent: -50, yPercent: -50 });
    };
    gsap.ticker.add(loop);
    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
      gsap.ticker.remove(loop);
    };
  }, []);

  useGSAP(() => {
    if (!cursorRef.current) return;
    
    if (variant === "default") {
      gsap.to(cursorRef.current, { scale: 1, opacity: 1, backgroundColor: "white", mixBlendMode: "difference", duration: 0.4 });
      if (textRef.current) gsap.to(textRef.current, { opacity: 0 });
    } 
    else if (variant === "text") {
      gsap.to(cursorRef.current, { scale: 6, backgroundColor: "white", mixBlendMode: "difference", duration: 0.5 });
      if (textRef.current) gsap.to(textRef.current, { opacity: 1 });
    }
if (variant === "mask") {
    // Pat diye yok olmak yerine yumuşakça solarak küçülür
    gsap.to(cursorRef.current, { 
      opacity: 0, 
      scale: 0, 
      duration: 0.5, 
      ease: "power2.out" 
    });
  } else {
    gsap.to(cursorRef.current, { 
      opacity: 1, 
      scale: variant === "text" ? 6 : 1, 
      duration: 0.5,
      ease: "expo.out"
    });
  }
  }, [variant]);

  return (
    <div ref={cursorRef} className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] flex items-center justify-center bg-white">
      <span ref={textRef} className="text-[2px] text-black font-bold opacity-0 uppercase tracking-widest">
        {cursorText}
      </span>
    </div>
  );
};

export default Cursor;