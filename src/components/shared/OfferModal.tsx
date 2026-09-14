"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import Image from "next/image";

import offerModal from "@/assets/Images/offermodal.png";

const OFFER_MODAL_SESSION_KEY = "offer-modal-shown";

export default function OfferModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasShown =
            sessionStorage.getItem(OFFER_MODAL_SESSION_KEY);

        if (!hasShown) {
            setIsOpen(true);

            sessionStorage.setItem(
                OFFER_MODAL_SESSION_KEY,
                "true"
            );
        }
    }, []);

    const handleClose = () => {
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
                                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:scale-105 hover:bg-neutral-900"
                                >
                                    <X
                                        size={20}
                                        strokeWidth={2}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}