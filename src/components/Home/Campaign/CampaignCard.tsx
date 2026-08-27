import { Campaign } from "@/types/campaign";
import Image from "next/image";
import Link from "next/link";

interface CampaignCardProps {
  campaign: Campaign;
}

// Purely presentational — no data fetching, no date logic. Just renders what it's given.
export default function CampaignCard({ campaign }: CampaignCardProps) {
  const { title, description, image, buttonText, destinationUrl } = campaign;
  const isExternal = /^https?:\/\//.test(destinationUrl);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="flex-1 text-sm text-neutral-400">{description}</p>

        <Link
          href={destinationUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="mt-3 inline-block rounded-lg bg-[#9D1749] px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#B01E56]"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}