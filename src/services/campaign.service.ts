import { mockCampaigns } from "@/Data/campaigns";
import { Campaign } from "@/types/campaign";

// --- Data-access layer ---
// This is the ONLY file that should change when the real backend exists.
// Swap the body below for:
//
//   export async function getCampaigns(): Promise<Campaign[]> {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`, {
//       cache: "no-store", // or revalidate, depending on how fresh campaigns need to be
//     });
//     if (!res.ok) throw new Error("Failed to fetch campaigns");
//     return res.json();
//   }
//
// The function signature (async, returns Promise<Campaign[]>) is already shaped
// to match that future call — CampaignSection doesn't need to change at all.
export async function getCampaigns(): Promise<Campaign[]> {
  return mockCampaigns;
}