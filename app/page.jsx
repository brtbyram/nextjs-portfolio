"use client";

import { useRef } from "react";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from "next/image";
import { Mask } from "@react-three/drei";
import MaskCursor from "@/components/MaskCursor";
import { useCursor } from "@/lib/context/CursorContext";
import RevealText from "@/app/resume/RevealText";
import clsx from "clsx";

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
  const footerRef = useRef(null);

  const { setVariant, setCursorText } = useCursor();

  // Helper fonksiyonlar
  const enterText = (text) => {
    setCursorText(text);
    setVariant("text");
  };

  const enterMask = () => setVariant("mask");
  const leave = () => {
    setVariant("default");
    setCursorText("");
  };

  useGSAP(() => {
    const item = itemsRef.current[0]; // burada ilk öğeyi alıyoruz 
    const footerRounded = footerRef.current.querySelector('.footer-rounded');
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

    gsap.to(footerRounded, {
      height: 0,
      ease: "power4.out",
      duration: 1.5,
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

  }, { scope: sectionRef, revertOnUpdate: true });

  // Metinleri render ederken dinamik olarak ref'lere atama
  const setItemRef = (el, index) => {
    if (el) itemsRef.current[index] = el;
  };


  const works = [{
    title: "Subrella",
    year: "2021",
    field: "subscription Management",
  },
  {
    title: "StayHubs",
    year: "2020",
    field: "Co-living Platform",
  },
  {
    title: "YourTrainer",
    year: "2022",
    field: "Fitness App",
  },
  {
    title: "FoodieFinds",
    year: "2019",
    field: "Restaurant Locator",
  },
  {
    title: "TravelMate",
    year: "2023",
    field: "Travel Services",
  },
  {
    title: "ShopSmart",
    year: "2021",
    field: "E-commerce",
  }
  ];

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

      <section className="works-section h-screen w-screen flex flex-col items-center justify-center space-y-3 bg-neutral-800 relative">

        {works.map((work, index) => (
          <div
            key={index}
            className={clsx(`work-item scene `, index % 2 === 0 ? '' : '')}
            onMouseEnter={() => enterText(work.title)}
            onMouseLeave={leave}>
            <div class="prism">
              <div class="face face-front text-4xl bg-neutral-200 px-5">
                <div className="">{work.title}</div>
                <div className="font-extrabold text-8xl">{work.year}</div>
              </div>
              <div class="face face-back"></div>
              <div class="face face-right"></div>
              <div class="face face-left"></div>
              <div class="face face-top bg-[#992e40]"></div>
              <div class="face face-bottom "></div>
            </div>
          </div>
        ))}

      </section>

      <section className=" h-screen w-screen flex flex-col items-center justify-center space-y-3 bg-neutral-100 relative">

        <div className="absolute bottom-10 text-center w-full text-black pointer-events-none ">
          <p className="text-2xl font-medium">Scroll down to see more</p>
        </div>

      </section>



      <section ref={footerRef} className="footer bg-[#1a1a1a] h-screen  text-white flex flex-col justify-between" >
        
        <div className="footer-rounded h-28 w-screen top-0 left-1/2 -translate-x-1/2 relative overflow-hidden">
          <div className="h-[550%] w-[150%] absolute  left-1/2 -translate-x-1/2 -translate-y-[86.66%] rounded-[50%] bg-neutral-100 " />
        </div>

        <div className="flex-1 flex items-end justify-center -translate-x-[1vw] md:-translate-y-[4vh]">
          <div style={{
            backgroundImage: 'linear-gradient(45deg, #ff8a00, #e52e71)',
            backgroundClip: 'text',
            WebkitTextStrokeWidth: '0.5vw',
            WebkitTextStrokeColor: '#d7d5d5',
            color: '#1a1a1a',
            WebkitBackgroundClip: 'text',
            fontWeight: '900',
          }} className="text-[25vw] italic h-96 w-screen flex items-end justify-center">
            bemuba
          </div>
        </div>
      </section>



    </main >
  );
}