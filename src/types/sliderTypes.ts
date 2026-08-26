import { StaticImageData } from "next/image"

export type HeroSlide = {
  id: string
  heading: string
  description: string
  desktopImage: string | StaticImageData
  mobileImage: string | StaticImageData
  ctaText: string
  ctaLink: string
}