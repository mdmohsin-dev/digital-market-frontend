import CampaignSection from "@/components/Home/Campaign/CampaignSection";
import CategorySection from "@/components/Home/categories/CategorySection";
import Hero from "@/components/Home/Hero/Hero";
import NewArrivalsSection from "@/components/Home/NewArrivalsSection";
import NewsletterSection from "@/components/Home/NewsLetterSection";

export default function Home() {
  return (
    <>
    <Hero/>
    <CategorySection/>
    <NewArrivalsSection/>
    <CampaignSection/>
    <NewsletterSection/>
    </>
  );
}
