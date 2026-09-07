import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Inter, Lora } from "next/font/google";

import "./globals.css";
import ScrollToTop from "@/components/shared/ScrollToTop";
import OfferModal from "@/components/shared/OfferModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Kanli",
  description: "Discover trendy fashion, accessories, and lifestyle products at Your Store.",
  keywords: [
    "fashion",
    "clothing",
    "men fashion",
    "women fashion",
    "kids fashion",
    "bags",
    "wedding",
    "home decor",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}
        <ScrollToTop />
        <OfferModal/>
        <ToastContainer position="top-right" theme="dark" />
      </body>
    </html>
  );
}