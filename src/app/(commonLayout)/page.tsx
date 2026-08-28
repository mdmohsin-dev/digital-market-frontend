import CampaignSection from "@/components/Home/Campaign/CampaignSection";
import CategorySection from "@/components/Home/categories/CategorySection";
import Hero from "@/components/Home/Hero/Hero";
import FeaturedProducts from "@/components/Home/products/FeaturedProducts";

export default function Home() {
  return (
    <>
    <Hero/>
    <CategorySection/>
    <CampaignSection/>
    <FeaturedProducts/>
    </>
  );
}
