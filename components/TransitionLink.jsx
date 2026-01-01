// components/TransitionLink.jsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { useTransitionStore } from "@/lib/store/transition.store";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export function TransitionLink({ href, children, ...props }) {
    const router = useRouter();
    const pathname = usePathname();
    const setSpa = useTransitionStore((s) => s.setSpaNavigation);

    const handleClick = () => {
        if (pathname === href) return;

        setSpa(true);

        // BAŞLANGIÇ: Alttan küçük bir kavis olarak başla
        gsap.set(".overlay", { clipPath: "ellipse(100% 0% at 50% 100%)" });

        // BİTİŞ: Ekranı tamamen kapla (Template'in başlangıç haliyle eşleşiyor)
        gsap.to(".overlay", {
            clipPath: "ellipse(100% 120% at 50% 100%)",
            duration: 1,
            ease: "power4.inOut",
            onComplete: () => router.push(href),
        });
        gsap.to(window, { scrollTo: 0, duration: 1, ease: "power4.inOut" });
    };

    return (
        <button onClick={handleClick} {...props}>
            {children}
        </button>
    );
}