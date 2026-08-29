"use client";

import newsletterbg from "@/assets/Images/newsletterbg.png";
import newsLetterImage from "@/assets/Images/newsLetterImage.png";
import { Mail } from "lucide-react";
import Image from "next/image";

export default function NewsletterSection() {
  return (
    <section
      aria-label="Newsletter"
      className=" bg-[#f9f7f4]"
      style={{
        backgroundImage: `url(${newsletterbg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative overflow-hidden max-w-350 mx-auto mt-32">
        {/* Newsletter Image */}
        <Image
          src={newsLetterImage.src}
          width={600}
          height={500}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 z-0"
        />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-350">
          <div className="flex h-auto flex-col justify-center py-14">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-600">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Stay Updated</span>
              </div>

              <h2 className="mt-4 text-3xl font-medium leading-tight text-neutral-900 sm:text-4xl md:text-5xl">
                Stay in the style loop
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600 sm:max-w-md sm:text-base md:max-w-lg">
                Subscribe to our newsletter and be the first to know about new
                arrivals, exclusive offers and special promotions.
              </p>

              <form
                className="mt-8"
                onSubmit={(e) => e.preventDefault()}
                aria-label="Newsletter subscription">
                <div className="flex flex-col gap-2 sm:flex-row max-w-md">
                  
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    required
                    className="w-full flex-1 rounded-md border border-neutral-300 bg-white/90 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  />

                  <button
                    type="submit"
                    className="rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
                  >
                    Subscribe
                  </button>
                </div>
              </form>

              <p className="mt-4 text-xs text-primary font-semibold">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}