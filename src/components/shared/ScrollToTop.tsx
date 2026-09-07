"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Circular progress
  const radius = 25;
  const circumference = 2 * Math.PI * radius;

  const dashOffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            y: "100vh",
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: "100vh",
            scale: 0.7,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="fixed bottom-22 right-6 z-50"
        >
          {/* Outer Progress Ring */}
          <div className="relative flex h-14 w-14 items-center justify-center">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 56 56"
              fill="none"
            >
              {/* Progress Track */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/20"
              />

              {/* Progress */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="text-primary transition-[stroke-dashoffset] duration-150"
              />
            </svg>

            {/* Button */}
            <motion.button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md"
            >
              <ChevronUp size={25} strokeWidth={2} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}