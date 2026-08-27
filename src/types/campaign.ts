// Shared contract between mock data and the future Express/Prisma API response.
// Keep this in sync with the Prisma `Campaign` model when the backend lands —
// that's what makes the swap to a real API a non-event for the UI layer.
export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  destinationUrl: string;
  startDate: string; // ISO 8601 string — matches JSON over the wire / Prisma DateTime serialization
  endDate: string;
  isActive: boolean;
}