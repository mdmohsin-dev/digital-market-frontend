import { filterVisibleCampaigns } from "@/lib/campaign-filters";
import { getCampaigns } from "@/services/campaign.service";
import CampaignCard from "./CampaignCard";

// Server Component: fetches via the service layer (mock today, real API later)
// and applies the reusable date filter before handing data to CampaignCard.
export default async function CampaignSection() {
  const allCampaigns = await getCampaigns();
  const visibleCampaigns = filterVisibleCampaigns(allCampaigns);

  if (visibleCampaigns.length === 0) return null;

  return (
    <section className="md:mt-32 mt-16 px-4">
      <div className="mx-auto max-w-350">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="mb-4 text-2xl lg:text-4xl font-bold font-lora text-black">Don’t Miss Out</h2>
          <p>Discover our latest collections, seasonal highlights, and exclusive offers, thoughtfully curated to bring you fresh styles and exciting finds. Explore each campaign and find something made for you.</p>
        </div>

        {/* Mobile: 1 col. Tablet & desktop: 2 side-by-side. */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {visibleCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
}