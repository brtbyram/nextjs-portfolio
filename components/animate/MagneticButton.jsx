"use client";

import { useEffect, useRef } from "react";
import React from "react";

export default function MagneticButton({ children, className }) {
  const buttonRef = useRef(null);

  const mousePosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const strength = 1.65;
  const radius = 150;

  // 1. Mouse Takibi
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current.x = e.clientX;
      mousePosition.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Button center
  const getButtonCenter = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  // 2. Buton Konumunu ve Boyutunu Hesapla (Resize Duyarlı)
  useEffect(() => {
    let raf;

    const animate = () => {
      if (!buttonRef.current) return;

      const center = getButtonCenter();

      const dx = mousePosition.current.x - center.x;
      const dy = mousePosition.current.y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy); 

      if (distance < radius) {
        const power = 1 - distance / radius;
        velocity.current.x = dx * power * strength;
        velocity.current.y = dy * power * strength;
      } else {
        velocity.current.x = 0;
        velocity.current.y = 0;
      }

      // LERP
      currentPosition.current.x += (velocity.current.x - currentPosition.current.x) * 0.1;
      currentPosition.current.y += (velocity.current.y - currentPosition.current.y) * 0.1;

      buttonRef.current.style.transform = `
        translate(${currentPosition.current.x}px, ${currentPosition.current.y}px)
      `;

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    React.cloneElement(children, { ref: mergeRefs(buttonRef, children.ref), className: className, style: {...children.props.style, willChange: "transform"}})
  )
}

// Ref'leri birleştirme yardımcı fonksiyonu 
function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    });
  };
}