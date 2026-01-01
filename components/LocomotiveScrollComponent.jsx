"use client";

import { useRef } from "react";
import useLocomotiveScroll from "../lib/hooks/useLocomotiveScroll";
// Hook'umuzu buraya import ettiğimiz varsayalım
const LocomotiveScrollComponent = ({ children }) => {
  // Hook'umuz, kapsayıcı DOM elementine referans almak için bir ref dönecektir.
  const scrollRef = useLocomotiveScroll();

  return (
    // Bu, Locomotive Scroll'un izleyeceği ana kapsayıcıdır.
    <div className="relative min-h-screen h-full w-full overflow-hidden" data-scroll-container ref={scrollRef}>
      {children}
      {/* Next.js tarafından render edilen tüm sayfa içeriği buraya gelecek */}
    </div>
  );
};

export default LocomotiveScrollComponent;
