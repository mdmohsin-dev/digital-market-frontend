"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Swiper as SwiperType } from "swiper";
import {
  A11y,
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { HeroSlide } from "@/types/sliderTypes";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

type HeroSliderProps = {
  slides: HeroSlide[];
};

export default function HeroSlider({ slides }: HeroSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section
      className="group relative w-full overflow-hidden"
      onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay?.start()}
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      <Swiper
        modules={[
          Navigation,
          Pagination,
          Autoplay,
          EffectFade,
          A11y,
        ]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop
        speed={prefersReducedMotion ? 0 : 800}
        autoplay={
          prefersReducedMotion
            ? false
            : {
                delay: 5000,
                disableOnInteraction: false,
              }
        }
        navigation={{
          prevEl: ".hero-swiper-prev",
          nextEl: ".hero-swiper-next",
        }}
        pagination={{
          clickable: true,
          el: ".hero-swiper-pagination",
        }}
        a11y={{
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          paginationBulletMessage: "Go to slide {{index}}",
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="hero-slider"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative min-h-[520px] w-full overflow-hidden sm:min-h-[600px] lg:min-h-[650px]">

              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.bgImage}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                  aria-hidden="true"
                />
              </div>

              {/* Soft background overlay */}
              <div className="absolute inset-0 bg-white/10" />

              {/* Main Content */}
              <div className="relative z-10 mx-auto flex h-full min-h-[520px] max-w-350 items-center px-5 sm:min-h-[600px] sm:px-8 lg:min-h-[650px] lg:px-10">

                {/* Left: Text */}
                <div className="flex w-full flex-col items-start justify-center gap-4 pb-72 sm:max-w-xl sm:pb-80 lg:w-1/2 lg:max-w-2xl lg:pb-0">

                  <h1 className="max-w-xl text-3xl font-bold leading-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
                    {slide.heading}
                  </h1>

                  <p className="max-w-xl text-sm leading-relaxed text-gray-800 md:text-lg">
                    {slide.description}
                  </p>

                  <Link
                    href={slide.ctaLink}
                    className="mt-2 inline-flex items-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-800 sm:px-7 sm:py-3.5 sm:text-base"
                  >
                    {slide.ctaText}
                  </Link>
                </div>

                {/* Right: Main Image */}
                <div className="absolute bottom-0 right-0 z-10 h-[360px] w-[75%] sm:h-[440px] sm:w-[65%] lg:right-0 lg:h-full lg:w-1/2">

                  {/* Desktop Image */}
                  <div className="absolute inset-0 hidden lg:block">
                    <Image
                      src={slide.desktopImage}
                      alt={slide.heading}
                      fill
                      priority
                      sizes="50vw"
                      className="object-contain object-right-bottom"
                    />
                  </div>

                  {/* Mobile / Tablet Image */}
                  <div className="absolute inset-0 lg:hidden">
                    <Image
                      src={slide.mobileImage}
                      alt={slide.heading}
                      fill
                      priority
                      sizes="75vw"
                      className="object-contain object-right-bottom"
                    />
                  </div>

                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Previous Button */}
      <button
        type="button"
        aria-label="Previous slide"
        className="hero-swiper-prev absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-gray-300 bg-white/80 p-2.5 text-gray-800 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 sm:left-5 sm:block"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Next Button */}
      <button
        type="button"
        aria-label="Next slide"
        className="hero-swiper-next absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-gray-300 bg-white/80 p-2.5 text-gray-800 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 sm:right-5 sm:block"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 18l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Pagination */}
      <div className="hero-swiper-pagination absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-6" />
    </section>
  );
}