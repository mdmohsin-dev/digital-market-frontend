import { Campaign } from "@/types/campaign";

// Reusable date-window logic, kept out of both CampaignCard (presentational)
// and CampaignSection (fetch/orchestration) so it can be unit-tested in isolation
// and reused later (e.g. an admin "preview visibility" screen).
export function isCampaignVisible(campaign: Campaign, now: Date = new Date()): boolean {
  if (!campaign.isActive) return false;

  const start = new Date(campaign.startDate);
  const end = new Date(campaign.endDate);

  return now >= start && now <= end;
}

export function filterVisibleCampaigns(
  campaigns: Campaign[],
  now: Date = new Date()
): Campaign[] {
  return campaigns.filter((campaign) => isCampaignVisible(campaign, now));
}