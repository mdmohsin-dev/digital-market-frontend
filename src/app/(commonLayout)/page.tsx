import BestSellingSection from "@/components/Home/BestSellingProductsSection";
import CampaignSection from "@/components/Home/Campaign/CampaignSection";
import CategorySection from "@/components/Home/categories/CategorySection";
import CustomerReviewsSection from "@/components/Home/CustomerReviewsSection";
import FlashSaleSection from "@/components/Home/Flash-sale/FlashSaleSection";
import Hero from "@/components/Home/Hero/Hero";
import NewArrivalsSection from "@/components/Home/NewArrivalsSection";
import NewsletterSection from "@/components/Home/NewsLetterSection";
import { flashSales } from "@/Data/flashSales";
import { products } from "@/Data/products";

export default function Home() {
  const activeFlashSale = flashSales[0]
  return (
    <>
      <Hero />
      <CategorySection />
      {activeFlashSale && (
        <FlashSaleSection
          flashSale={
            activeFlashSale
          }
          products={products}
        />
      )}
      <NewArrivalsSection />
      <BestSellingSection />
      <CampaignSection />
      <CustomerReviewsSection />
      <NewsletterSection />
    </>
  );
}
