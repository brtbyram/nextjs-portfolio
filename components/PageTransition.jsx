"use client";

import { AnimatePresence, delay, motion } from 'framer-motion'
import { usePathname } from 'next/navigation';

function PageTransition({ children }) {

    const pathname = usePathname()

    return (
        <AnimatePresence>
            <div key={pathname}>
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{
                        opacity: 0,
                        transition: { duration: 2, delay: 0, ease: 'easeInOut' }
                    }}
                    className="h-screen w-screen fixed bg-primary top-0 pointer-events-none z-50"
                />
                {children}
            </div>
        </AnimatePresence>
    )
}

export default PageTransition