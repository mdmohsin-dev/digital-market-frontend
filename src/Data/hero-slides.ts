import { HeroSlide } from "@/types/sliderTypes";

import slider1 from "@/assets/Images/slider5.png"
import slider2 from "@/assets/Images/slider1.png"
import slider3 from "@/assets/Images/slider3.png"

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
    heading: "Discover Effortless Style with Our New Summer Collection",
    description: "Explore our latest summer collection, thoughtfully selected to bring together modern design, everyday comfort, and timeless style. Discover versatile pieces made for effortless looks.",
    desktopImage: slider2,
    mobileImage: slider2,
    ctaText: "Explore",
    ctaLink: "/products?filter=new",
  },
  {
    id: "hero-3",
    heading: "Limited Time Offer",
    description: "Up to 40% off on selected categories. Ends soon.",
    desktopImage: slider3,
    mobileImage: "/images/hero/hero-3-mobile.webp",
    ctaText: "Grab the Deal",
    ctaLink: "/products?filter=sale",
  },
]