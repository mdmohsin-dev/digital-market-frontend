import { Campaign } from "@/types/campaign";

// Temporary mock source. Once the backend exists, this file goes away entirely —
// campaign.service.ts will fetch from `GET /api/campaigns` instead.
export const mockCampaigns: Campaign[] = [
  {
    id: "camp-001",
    title: "Winter Audio Sale",
    description: "Up to 40% off headphones and speakers. Limited stock, ends soon.",
    image: "/images/campaigns/winter-audio-sale.jpg",
    buttonText: "Shop the Sale",
    destinationUrl: "/category/headphone",
    startDate: "2026-08-01T00:00:00.000Z",
    endDate: "2026-09-15T23:59:59.000Z",
    isActive: true,
  },
  {
    id: "camp-002",
    title: "New Drone Lineup",
    description: "Explore our latest drones with 4K stabilized cameras.",
    image: "/images/campaigns/new-drones.jpg",
    buttonText: "Discover Drones",
    destinationUrl: "/category/drone",
    startDate: "2026-08-20T00:00:00.000Z",
    endDate: "2026-10-01T23:59:59.000Z",
    isActive: true,
  },
  {
    id: "camp-003",
    title: "Upcoming Smartwatch Drop",
    description: "Something new is coming to our smartwatch collection.",
    image: "/images/campaigns/smartwatch-teaser.jpg",
    buttonText: "Notify Me",
    destinationUrl: "/category/smartwatch",
    startDate: "2026-12-01T00:00:00.000Z", // future — should NOT display yet
    endDate: "2026-12-31T23:59:59.000Z",
    isActive: true,
  },
  {
    id: "camp-004",
    title: "Expired Router Promo",
    description: "This one already ran — good for testing the date filter.",
    image: "/images/campaigns/router-promo.jpg",
    buttonText: "Shop Routers",
    destinationUrl: "/category/router",
    startDate: "2026-06-01T00:00:00.000Z",
    endDate: "2026-07-01T23:59:59.000Z", // past — should NOT display
    isActive: true,
  },
];