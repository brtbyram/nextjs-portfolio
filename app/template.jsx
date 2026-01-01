// app/template.jsx
"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTransitionStore } from "@/lib/store/transition.store";

const introWords = ["hello", "bonjour", "Ciao", "Guten tag", "hallo", "स्वागत हे", "سلام", "Hallå", "おい", "zdravstvuyte", "Olá", "merhaba"];

const titles = {
  "/": "Home",
  "/about": "About",
  "/contact": "Contact",
  "/services": "Services",
  "/resume": "Resume",
  "/work": "Work",
};

export default function Template({ children }) {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const { isSpaNavigation, setSpaNavigation } = useTransitionStore();

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const overlay = ".overlay";
      const text = ".text";
      const content = ".children";

      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => setSpaNavigation(false)// Animasyon bitince flag'i kapat
      });

      // 1. BAŞLANGIÇ AYARI (FOUC ÖNLEME)
      // TransitionLink'in bittiği yer ile birebir aynı:
      gsap.set(overlay, { clipPath: "ellipse(100% 120% at 50% 100%)" });
      gsap.set(content, { y: "100%" });

      // Metni görünür yap (ama içeriğini aşağıda belirleyeceğiz)
      gsap.set(text, { autoAlpha: 1 });

      // 2. TEXT İÇERİK MANTIĞI
      if (pathname === "/" && !isSpaNavigation) {
        // Sadece tam sayfa yenilemede (Reload) intro kelimeleri dönsün
        // Eğer her anasayfaya dönüşte çıksın istersen `!isSpaNavigation` şartını kaldır.
        introWords.forEach((word, i) => {
          tl.to(text, {
            duration: 0.001, // Anlık değişim
            onStart: () => {
              const el = document.querySelector(text);
              if (el) el.textContent = word;
            }
          })
            .to({}, { duration: 0.15 }); // Her kelime bekleme süresi
        });

        // Son kelimede biraz daha uzun bekle
        tl.to({}, { duration: 0.8 });

      } else {
        // Diğer sayfalar veya SPA geçişleri için tek başlık
        const currentTitle = titles[pathname] || pathname.replace("/", "");

        // İçeriği ayarla
        tl.to(text, {
          duration: 0.001,
          onStart: () => {
            const el = document.querySelector(text);
            if (el) el.textContent = currentTitle;
          }
        })
          .to({}, { duration: 0.8 }); // Başlığı okuması için süre tanı
      }

      // Sayfa içeriğini en üstte başlat
      tl.to(window, { scrollTo: 0, duration: 0.1 });

      // 3. ÇIKIŞ ANİMASYONU (Reveal)
      // Yazıyı kaybet
      tl.to(text, { autoAlpha: 0, duration: 0.4 });

      // Overlay'i senin orijinal stilinle yukarı doğru çek
      tl.to(overlay, {
        clipPath: "ellipse(100% 40% at 50% -50%)", // Orijinal bitiş değerin
        duration: 1.4
      }, "-=0.6"); // Yazı kaybolurken başla

      // 4. İÇERİĞİ AŞAĞIDAN GETİR
      tl.to(content, { y: 0, duration: 1.4 }, "-=1.6"); // Overlay ile eş zamanlı başla

    }, containerRef);

    return () => ctx.revert();

  }, { scope: containerRef, dependencies: [pathname] });

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Orijinal Stillerin Korundu */}
      <div className="overlay fixed inset-0 z-[9999] bg-primary pointer-events-none" />
      <li className="text list-disc fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] text-5xl text-white capitalize opacity-0" />
      <div className="children">{children}</div>
    </div>
  );
}