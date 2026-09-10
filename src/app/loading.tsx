import Image from "next/image";
import logo from "@/assets/Images/favicon.png"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fdf9f6]">
      <div className="flex flex-col items-center">
        {/* Loading Circle */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          {/* Background Circle */}
          <div className="absolute inset-0 rounded-full border-[5px] border-[#e2dedb]" />

          {/* Animated Progress Circle */}
          <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-transparent border-t-[#d4145a] border-r-[#d4145a]" />

          {/* Empty Logo Area */}
          <div className="relative z-10 flex h-16 w-16 items-center justify-center">
            

              <Image
                src={logo}
                alt="Kalni"
                width={45}
                height={45}
                className="object-contain"
              />
            
          </div>
        </div>

        {/* Loading Text */}
        <p className="mt-5 text-sm tracking-[0.35em] text-neutral-700">
          Loading...
        </p>
      </div>
    </div>
  );
}