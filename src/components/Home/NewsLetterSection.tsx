"use client";

import newsletterbg from "@/assets/Images/newsletterbg.png";
import newsLetterImage from "@/assets/Images/newsLetterImage.png";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface NewsletterFormData {
  email: string;
}

export default function NewsletterSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>();

  const onSubmit = (data: NewsletterFormData) => {
    console.log("Subscribed email:", data.email);

    toast.success("Successfully subscribed to our newsletter!");

    reset();
  };

  return (
    <section
      aria-label="Newsletter"
      className="bg-[#f9f7f4] max-w-350 mx-auto px-8 rounded-xl md:mt-32 mt-18 -mb-36 relative z-10"
      style={{
        backgroundImage: `url(${newsletterbg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative overflow-hidden">
        {/* Newsletter Image */}
        <Image
          src={newsLetterImage.src}
          width={500}
          height={500}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 z-0"
        />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-350">
          <div className="flex h-auto flex-col justify-center py-12">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-600">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Stay Updated</span>
              </div>

              <h2 className="mt-4 text-3xl font-lora font-medium leading-tight text-neutral-900 sm:text-4xl md:text-5xl">
                Stay in the style loop
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600 sm:max-w-md sm:text-base md:max-w-lg">
                Subscribe to our newsletter and be the first to know about new
                arrivals, exclusive offers and special promotions.
              </p>

              <form
                className="mt-8"
                onSubmit={handleSubmit(onSubmit)}
                aria-label="Newsletter subscription"
              >
               <div className="flex flex-col gap-2 sm:flex-row max-w-md items-start">
  <div className="w-full">
    <input
      id="newsletter-email"
      type="email"
      autoComplete="email"
      placeholder="Enter your email address"
      {...register("email", {
        required: "Email address is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Please enter a valid email address",
        },
      })}
      className={`w-full rounded-md border bg-white/90 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 ${
        errors.email
          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
          : "border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500"
      }`}
    />

    {errors.email && (
      <p className="mt-1.5 text-xs font-medium text-red-500">
        {errors.email.message}
      </p>
    )}
  </div>

  <button
    type="submit"
    className="h-[46px] shrink-0 rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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