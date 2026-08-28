import { getCampaigns } from "@/services/campaign.service";
import { filterVisibleCampaigns } from "@/lib/campaign-filters";
import CampaignCard from "./CampaignCard";

// Server Component: fetches via the service layer (mock today, real API later)
// and applies the reusable date filter before handing data to CampaignCard.
export default async function CampaignSection() {
  const allCampaigns = await getCampaigns();
  const visibleCampaigns = filterVisibleCampaigns(allCampaigns);

  if (visibleCampaigns.length === 0) return null;

  return (
    <section className="bg-black py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-2xl font-bold text-white">Current Campaigns</h2>

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