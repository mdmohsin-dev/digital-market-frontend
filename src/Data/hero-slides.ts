import { HeroSlide } from "@/types/sliderTypes";

import slider1 from "@/assets/Images/kdvcy1786290971-light-1000x400.png"


export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    heading: "Summer Collection",
    description: "Discover our latest arrivals, crafted for the season ahead.",
    desktopImage: slider1,
    mobileImage: slider1,
    ctaText: "Shop Now",
    ctaLink: "/products",
  },
  {
    id: "hero-2",
    heading: "New Arrivals",
    description: "Fresh drops every week. Be the first to grab yours.",
    desktopImage: "/images/hero/hero-2-desktop.webp",
    mobileImage: "/images/hero/hero-2-mobile.webp",
    ctaText: "Explore",
    ctaLink: "/products?filter=new",
  },
  {
    id: "hero-3",
    heading: "Limited Time Offer",
    description: "Up to 40% off on selected categories. Ends soon.",
    desktopImage: "/images/hero/hero-3-desktop.webp",
    mobileImage: "/images/hero/hero-3-mobile.webp",
    ctaText: "Grab the Deal",
    ctaLink: "/products?filter=sale",
  },
]