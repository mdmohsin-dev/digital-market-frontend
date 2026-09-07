import CheckoutClient from "@/components/checkout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Kalni",
  description:
    "Complete your order securely and provide your delivery information at Kalni.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}