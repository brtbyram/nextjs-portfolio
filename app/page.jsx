"use client";

import { useRef } from "react";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from "next/image";
import { Mask } from "@react-three/drei";
import MaskCursor from "@/components/MaskCursor";


// GSAP eklentilerini kaydet
gsap.registerPlugin(ScrollTrigger);

const TEXT_CONTENT = "Berat Murathan Bayram —";
const REPEAT_COUNT = 5; // Metni 5 kez tekrarlayarak akışkanlığı artırın

export default function Home() {
  const container = useRef(null);
  const sectionRef = useRef(null); // Tüm bölüm için ref
  const wrapperRef = useRef(null); // Metinleri saran dış div
  const tlRef = useRef(null);      // Timeline referansı
  const itemsRef = useRef([]);     // Kopyalanmış metin öğeleri için ref

  useGSAP(() => {
    const item = itemsRef.current[0]; // burada ilk öğeyi alıyoruz 
    if (!item) return;

    // İlk öğenin genişliği kadar kaydıracağız
    const itemWidth = item.offsetWidth;

    // Temizlik: Mevcut timeline'ı öldür
    if (tlRef.current) {
      tlRef.current.kill();
    }

    // 1. Marquee (Sürekli Kaydırma) Timeline'ı Oluştur
    const tl = gsap.timeline({
      repeat: -1,
      ease: "none",
      paused: false // Animasyonun hemen başlamasını sağlar
    });

    // **İyileştirme:** Başlangıçta metnin SAĞA kaymasını sağlamak için timeScale'i ters çevir.
    tl.timeScale(-1);
    tlRef.current = tl;

    // wrapper'ı sürekli sola kaydır. Hedef: ilk öğenin negatif genişliği (-itemWidth)
    tl.to(wrapperRef.current, {
      x: -itemWidth,
      // **Performans İyileştirme:** Sabit, yüksek bir süre ayarlayın.
      duration: 20, // Süre: 15 saniye (hızı ayarlar)
      ease: "none",
      // **Performans İyileştirme:** GPU hızlandırmasını etkinleştir.
      force3D: true
    });

    // 2. SCROLLTRIGGER ile Yön Kontrolü
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",     // Bölüm ekrana girerken
      end: "bottom top",       // Bölüm ekrandan çıkarken

      onUpdate: (self) => {
        // Aşağı kaydırma (self.direction === 1): Metin SAĞA kaysın (timeScale: -1)
        // Yukarı kaydırma (self.direction === -1): Metin SOLA kaysın (timeScale: 1)

        if (self.direction === 1) {
          // timeScale'i yumuşak geçişle -1'e getir (Sağa Kay)
          gsap.to(tl, { timeScale: -1, duration: 0.3 });
        } else if (self.direction === -1) {
          // timeScale'i yumuşak geçişle 1'e getir (Sola Kay)
          gsap.to(tl, { timeScale: 1, duration: 0.3 });
        }
      }
    });

    gsap.to(tl, { timeScale: -1, duration: 0, delay: 0 });

  }, { scope: sectionRef, revertOnUpdate: true });

  // Metinleri render ederken dinamik olarak ref'lere atama
  const setItemRef = (el, index) => {
    if (el) itemsRef.current[index] = el;
  };

  return (
    <main className="min-h-screen overflow-x-hidden h-full" ref={container}>

      <section className="h-full relative" ref={sectionRef}>
        <div className='bg-[#a0a0a0] relative h-screen flex justify-center items-center overflow-hidden'>
          <Image

            src="/assets/my-photo2.png"
            alt="Resume"
            width={750}
            height={1000}
            className="absolute bottom-0 max-sm:h-4/6 max-sm:w-auto object-contain max-md:scale-125 z-[3000] pointer-events-none"
          />


          <div
            ref={sectionRef}
            style={{
              marginTop: '60vh',
              padding: '20px 0',
              position: 'relative',
              zIndex: 5000,
              pointerEvents: 'none', // İmleç etkileşimlerini devre dışı bırak
            }}
          >
            <div
              ref={wrapperRef}
              className="flex text-nowrap  text-[8rem] md:text-[15rem] lg:text-[17rem] text-white"
            >
              {/* Metni tekrarlama sayısı kadar render et */}
              {Array(REPEAT_COUNT).fill(TEXT_CONTENT).map((content, index) => (
                <span key={index} ref={el => setItemRef(el, index)} style={{ padding: '0 20px' }}>
                  {content}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <MaskCursor />


      <section className="hero">
        <div className="flex justify-center items-center h-full">
          <h1 className="text-4xl font-bold text-black">
            Designed and developed by Berat Murathan Bayram
          </h1>
        </div>
      </section>

      <section className="spotlight text-black">
        <div className="row">
          <div><Image src="/assets/my-photo2.png" width={200} height={200} /></div>
        </div>
        <div className="row">
          <div className="col">
            <div className="card">
              <h2>
                A portfolio showcasing the design and development work of Berat Murathan Bayram.
              </h2>
              <p >
                From web applications to mobile apps, explore a diverse range of projects that highlight creativity, technical skills, and a passion for crafting exceptional digital experiences.
              </p>
            </div>
          </div>
          <div className="col">
            <div>
              <Image src="/assets/my-photo2.png" width={200} height={200} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div>
              <Image src="/assets/my-photo2.png" width={200} height={200} />
            </div>
          </div>
          <div className="col">
            <div className="card">
              <h2>
                Explore the portfolio of Berat Murathan Bayram, a talented designer and developer.
              </h2>
              <p>
                Discover a collection of innovative projects that demonstrate expertise in web and mobile development, UI/UX design, and creative problem-solving.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="img">
            <Image src="/assets/my-photo2.png" width={200} height={200} />
          </div>
        </div>
        <div className="svg-path">
          <svg width="2626" height="3685" viewBox="0 0 2626 3685" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1467.96 185.748C1467.96 152.248 1509.75 -271.625 290.686 797.748C-837.656 1787.54 2844.09 1814.76 2531.05 2549.56C2218.01 3284.37 -238.795 3270.79 290.686 2370.72C820.168 1470.64 1677.86 3657.25 1677.86 3657.25" stroke="#455CE9" stroke-width="150" />
          </svg>

        </div>
      </section>

      <section className="outro">
        <h1 className="text-4xl font-bold text-black">Clearer organization
          of portfolio items coming soon...
        </h1>
      </section>

    </main >
  );
}