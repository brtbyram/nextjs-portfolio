"use client"

import React, { useRef, useEffect } from 'react';

const Contact = () => {
  const textRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let position = 0;

    const animate = () => {
      position -= 6; // Hızı ayarlamak için bu değeri değiştir
      if (textRef.current) {
        textRef.current.style.transform = `translateX(${position}px)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="overflow-hidden whitespace-nowrap bg-black text-white h-screen flex items-center">
      <div ref={textRef} className="text-[10vw] font-bold tracking-tight">
        <span className="mx-4">Berat Murathan Bayram —</span>
        <span className="mx-4">Berat Murathan Bayram —</span>
        <span className="mx-4">Berat Murathan Bayram —</span>
        <span className="mx-4">Berat Murathan Bayram —</span>

      </div>
    </div>
  );
};

export default Contact;