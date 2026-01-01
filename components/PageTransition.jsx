"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAnimate } from "framer-motion";

const introWords = ["Hello", "Merhaba", "Bonjour", "Hola", "Ciao", "Hallo"];

function PageTransition({ children }) {
    const pathname = usePathname();

    const [introDone, setIntroDone] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const isHome = pathname === "/";

    const [scope, animate] = useAnimate(); // framer-motion'un useAnimate hook'u ile animasyonları kontrol ediyoruz 

    useEffect(() => {
        animate(scope.current,
            { // keyframe değerleri
                clipPath: [
                    "ellipse(50% 40% at 50% 150%)", // bu değerlerin sonucunda siyah panel tam ekran olur ve ortalanır 
                    "ellipse(100% 70% at 50% 50%)", // bu değerlerle panel tam ekran olur
                    "ellipse(150% 100% at 50% 50%)", // bu değerlerle panel tam ekran olur ve ortalanır
                    "ellipse(100% 150% at 50% 50%)",
                    "ellipse(50% 30% at 50% -50%)"
                ],
            },
            {
                duration: isHome ? 5 : 4,
                ease: "easeInOut"
            }
        );
    }, [pathname, animate, scope, isHome]);

    // INTRO sadece 1 kere oynar
    useEffect(() => {

        if (introDone) return;
        if (!isHome) {
            setIntroDone(true);
            return;
        }

        let index = 0;
        const interval = setInterval(() => {
            index++;
            if (index >= introWords.length) {
                clearInterval(interval);
                setTimeout(() => setIntroDone(true), 300);
            } else {
                setCurrentWordIndex(index);
            }
        }, 200);

        return () => clearInterval(interval);
    }, [introDone, isHome]);

    // Intro bitmeden children göstermiyoruz
    const showContent = introDone || !isHome;

    // Sayfa başlığını path’e göre gösterelim
    const getPageTitle = () => {
        if (isHome) return "HOME";
        return pathname.replace("/", "").toUpperCase();

    };

    return (
        <AnimatePresence mode="wait">
            <motion.div key={pathname} className="relative min-h-screen h-full w-full bg-white">

                <motion.div
                    ref={scope}
                    initial={{ y: "100%" }} // buradaki değerler sırasıyla x-y eksenindeki yarıçapları temsil eder. 
                    animate={{
                        transition: {y: "0%", duration: 4, ease: "easeInOut" },
                    }}
                    exit={{
                        y: "0%",
                        transition: { duration: 4, ease: "easeInOut" },
                    }}
                    className="h-screen w-screen fixed bg-primary top-0 pointer-events-none z-[12000]"
                >
                    <motion.div
                        key={introDone ? pathname : "intro"}
                        initial={{ }}
                        animate={{ transition: { duration: 0.5, delay: 1.4 } }}
                        exit={{ }}
                        className="fixed top-0 left-0 w-screen h-screen  flex items-center justify-center pointer-events-none"
                    >
                        {/* INTRO → sadece home ilk açılış */}
                        {!introDone && isHome ? (
                            <span className="text-white text-5xl font-bold">
                                {introWords[currentWordIndex]}
                            </span>
                        ) : (
                            // Diğer sayfalarda sadece sayfa başlığı
                            <span className="text-white text-5xl font-bold">
                                {getPageTitle()}
                            </span>
                        )}
                    </motion.div>
                </motion.div>

                {/* SİYAH PANELİN ORTASINDAKİ YAZI */}


                {/* ASIL SAYFA İÇERİĞİ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: showContent ? 1 : 0,
                        transition: { delay: 2.4, duration: 0.5 },
                    }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default PageTransition;