"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import offerModal from "@/assets/Images/offermodal.png"
import Image from "next/image";

const DONT_SHOW_AGAIN_KEY = "offer-modal-dont-show-again";

export default function OfferModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const alreadyDisabled = sessionStorage.getItem(
      DONT_SHOW_AGAIN_KEY
    );

    if (!alreadyDisabled) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      sessionStorage.setItem(
        DONT_SHOW_AGAIN_KEY,
        "true"
      );
    }

    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999] bg-black/10 backdrop-blur-xs"
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 50,
              scale: 0.95,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              
              {/* Offer Image */}
              <div className="relative w-full">
                <Image
                  src={offerModal}
                  alt="Special offer"
                  className="block h-auto w-full"
                />

                {/* Close X */}
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close offer"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-md text-white transition hover:bg-neutral-900 hover:scale-105"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="flex flex-col gap-4 border-t border-neutral-200 bg-primary px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                
                {/* Don't show again */}
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(event) =>
                      setDontShowAgain(event.target.checked)
                    }
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />

                  <span className="text-md font-medium text-white">
                    Don't show again
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}