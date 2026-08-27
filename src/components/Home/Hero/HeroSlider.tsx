"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectFade, A11y } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { HeroSlide } from "@/types/sliderTypes"

type HeroSliderProps = {
  slides: HeroSlide[]
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches)

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  if (!slides || slides.length === 0) return null

  return (
    <section
      className="group relative w-full overflow-hidden"
      onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay?.start()}
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={prefersReducedMotion ? 0 : 800}
        autoplay={
          prefersReducedMotion
            ? false
            : { delay: 5000, disableOnInteraction: false }
        }
        navigation={{
          prevEl: ".hero-swiper-prev",
          nextEl: ".hero-swiper-next",
        }}
        pagination={{ clickable: true, el: ".hero-swiper-pagination" }}
        a11y={{
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          paginationBulletMessage: "Go to slide {{index}}",
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper
        }}
        className="hero-slider"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[70vh] min-h-[420px] w-full sm:h-[80vh] sm:min-h-[520px]">
              {/* Desktop image */}
              <div className="absolute inset-0 hidden sm:block">
                <Image
                  src={slide.desktopImage}
                  alt={slide.heading}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              {/* Mobile image */}
              <div className="absolute inset-0 block sm:hidden">
                <Image
                  src={slide.mobileImage}
                  alt={slide.heading}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              {/* Overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

              {/* Content */}
              <div className="max-w-7xl mx-auto relative z-10 flex h-full flex-col sm:items-start justify-start gap-3 pb-16 sm:justify-center sm:gap-4 sm:pb-0">
                <h1 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                  {slide.heading}
                </h1>
                <p className="max-w-2xl text-sm text-white/90 sm:text-base md:text-lg">
                  {slide.description}
                </p>
                <Link
                  href={slide.ctaLink}
                  className="mt-2 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 sm:text-base"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Prev / Next controls */}
      <button
        type="button"
        aria-label="Previous slide"
        className="hero-swiper-prev absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-black opacity-0 transition hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 sm:left-4 sm:block"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className="hero-swiper-next absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-black opacity-0 transition hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 sm:right-4 sm:block"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Pagination dots */}
      <div className="hero-swiper-pagination absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-6" />
    </section>
  )
}