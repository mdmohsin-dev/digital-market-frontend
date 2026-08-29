import { HeroSlide } from "@/types/sliderTypes";

import slider1Man from "@/assets/Images/slider/slider-girl.png"
import slider1Bg from "@/assets/Images/slider/slider1bg.png"
import slider2Man from "@/assets/Images/slider/slider-boy.png"
import slider2Bg from "@/assets/Images/slider/slider2bg.png"
import slider3Man from "@/assets/Images/slider/slider-wedding.png"
import slider3Bg from "@/assets/Images/slider/slider3bg.png"

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    heading: "Elevate Your Everyday Style",
    description: "Discover timeless essentials and modern looks designed for comfort, confidence, and effortless style.",
    desktopImage: slider1Man,
    mobileImage:slider1Man,
    ctaText: "Shop Now",
    ctaLink: "/shop?category=women",
    bgImage:slider1Bg
  },
  {
    id: "hero-2",
    heading: "Discover Your Signature Style",
    description: "Explore elegant and modern styles designed to make every look feel confident, effortless, and uniquely yours.",
    desktopImage: slider2Man,
    mobileImage: slider2Man,
    ctaText: "Explore More",
    ctaLink: "/shop?category=men",
    bgImage:slider2Bg
  },
  {
    id: "hero-3",
    heading: "Celebrate Your Special Day in Style",
    description: "Discover elegant wedding outfits for every unforgettable moment. From timeless bridal sarees to sophisticated groom wear, find the perfect look for your special day",
    desktopImage: slider3Man,
    mobileImage: slider3Man,
    ctaText: "Explore Collection",
    ctaLink: "/shop?category=wedding",
    bgImage:slider3Bg
  },
]