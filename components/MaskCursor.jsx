'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function MaskCursor({ className, revealText, currentText, children }) {
  const containerRef = useRef(null);
  const maskRef = useRef(null);

  useGSAP(() => {
    const xTo = gsap.quickTo(maskRef.current, "--x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(maskRef.current, "--y", { duration: 0.4, ease: "power3" });

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };

    // MOUSE EKRANDAN TAMAMEN ÇIKARSA KÜÇÜLT
    const handleMouseLeaveWindow = () => {
      gsap.to(maskRef.current, { "--size": "40px", duration: 0.4, ease: "power2.out" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    // Mouse pencereden veya ana alandan ayrıldığında tetiklenir
    containerRef.current.addEventListener("mouseleave", handleMouseLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (containerRef.current) containerRef.current.removeEventListener("mouseleave", handleMouseLeaveWindow);
    };
  }, { scope: containerRef });

  // Yazı üzerine gelince boyutu büyüt
  const onEnterText = () => {
    gsap.to(maskRef.current, { "--size": "400px", duration: 0.6, ease: "back.out(1.5)" });
  };

  // Yazıdan çıkınca (ama hala siyah alan içindeyken) küçült
  const onLeaveText = () => {
    gsap.to(maskRef.current, { "--size": "24px", duration: 0.4, ease: "power2.out" });
  };

  return (
    <main ref={containerRef} className={className}>
      {/* KATMAN 1: Alt Katman (Normal Yazı) */}
     
        <p className="max-w-max select-none">
          {currentText}
        </p>
      

      {/* KATMAN 2: GSAP Destekli Maske Katmanı */}
      <div
        ref={maskRef}
        className="absolute inset-0  pointer-events-none bg-white mix-blend-difference px-10 select-none "
        style={{
          // İlk değerler (JS gelene kadar boş kalmasın)
          "--x": "0px",
          "--y": "0px",
          "--size": "24px",

          // Maskeleme Ayarları
          WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='50' fill='black'/%3E%3C/svg%3E")`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: "var(--size)",
          // Mouse'u tam merkeze alan calc formülü
          WebkitMaskPosition: "calc(var(--x) - (var(--size) / 2)) calc(var(--y) - (var(--size) / 2))",
          willChange: "mask-position, mask-size" // Performans için
        }}
      >
        <p
          onMouseEnter={onEnterText}
          onMouseLeave={onLeaveText}
          className=" pointer-events-auto max-w-max"
        >
          {revealText}
        </p>
      </div>

        <div>{children}</div>
    </main>
  );
}