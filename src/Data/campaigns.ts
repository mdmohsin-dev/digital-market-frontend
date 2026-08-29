import { Campaign } from "@/types/campaign";

// Temporary mock source. Once the backend exists, this file goes away entirely —
// campaign.service.ts will fetch from `GET /api/campaigns` instead.

import campaign1Image from "@/assets/Images/campaign1.png"
import campaign2Image from "@/assets/Images/campaing2.png"

export const mockCampaigns: Campaign[] = [
  {
    id: "camp-001",
    title: "Make Your Look Stand Out",
    description: "Refresh your wardrobe with timeless pieces and modern essentials, selected to make every look refined.",
    image: campaign1Image,
    buttonText: "Explore More",
    destinationUrl: "/category/headphone",
    startDate: "2026-08-01T00:00:00.000Z",
    endDate: "2026-09-15T23:59:59.000Z",
    isActive: true,
  },
  {
    id: "camp-002",
    title: "Up to 40% Off",
    description: "A thoughtfully selected collection of modern essentials and standout pieces, made for every kind of day.",
    image: campaign2Image,
    buttonText: "Shop Now",
    destinationUrl: "/category/drone",
    startDate: "2026-08-20T00:00:00.000Z",
    endDate: "2026-10-01T23:59:59.000Z",
    isActive: true,
  },
];