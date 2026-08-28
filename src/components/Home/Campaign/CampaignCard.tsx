import { Campaign } from "@/types/campaign";
import Link from "next/link";

interface CampaignCardProps {
  campaign: Campaign;
}

// Purely presentational — no data fetching, no date logic. Just renders what it's given.
// Image is applied as a CSS background (not <img>) so text/CTA can sit on top of it
// with an overlay, and so cover/center/no-repeat behavior is trivial via Tailwind.
export default function CampaignCard({ campaign }: CampaignCardProps) {
  const { title, description, image, buttonText, destinationUrl } = campaign;
  const isExternal = /^https?:\/\//.test(destinationUrl);

  return (
    <div
      className="relative flex h-72 flex-col overflow-hidden rounded-xl border border-white/10 bg-cover bg-center bg-no-repeat sm:h-80 md:h-96"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Overlay: dark at the bottom for text legibility, fading out toward the top so the image stays visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      {/* Content sits above the overlay, anchored to the bottom of the card */}
      <div className="relative z-10 mt-auto flex flex-col gap-2 p-5 md:p-6">
        <h3 className="text-lg font-semibold text-white drop-shadow-sm md:text-xl">
          {title}
        </h3>
        <p className="text-sm text-neutral-200 drop-shadow-sm">{description}</p>

        <Link
          href={destinationUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="mt-2 inline-block w-fit rounded-lg bg-[#9D1749] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B01E56]"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}