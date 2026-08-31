"use client";

import { useEffect, useState } from "react";

interface FlashSaleCountdownProps {
    endAt: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function getTimeLeft(endAt: string): TimeLeft {
    const difference =
        new Date(endAt).getTime() - Date.now();

    if (difference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    }

    return {
        days: Math.floor(
            difference / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
            (difference / (1000 * 60)) % 60
        ),
        seconds: Math.floor(
            (difference / 1000) % 60
        ),
    };
}

export default function FlashSaleCountdown({
    endAt,
}: FlashSaleCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(
        () => getTimeLeft(endAt)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(endAt));
        }, 1000);

        return () => clearInterval(interval);
    }, [endAt]);

    const isExpired =
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0;

    if (isExpired) {
        return (
            <span className="text-sm font-semibold text-red-500">
                Sale Ended
            </span>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {timeLeft.days > 0 && (
                <>
                    <TimeBox
                        value={timeLeft.days}
                        label="Days"
                    />

                    <span>:</span>
                </>
            )}

            <TimeBox
                value={timeLeft.hours}
                label="Hrs"
            />

            <span>:</span>

            <TimeBox
                value={timeLeft.minutes}
                label="Min"
            />

            <span>:</span>

            <TimeBox
                value={timeLeft.seconds}
                label="Sec"
            />
        </div>
    );
}

function TimeBox({
    value,
    label,
}: {
    value: number;
    label: string;
}) {
    return (
        <div className="flex items-baseline gap-1">
            <span className="text-xl font-semibold tabular-nums">
                {String(value).padStart(2, "0")}
            </span>

            <span className="text-[10px] uppercase text-gray-500">
                {label}
            </span>
        </div>
    );
}