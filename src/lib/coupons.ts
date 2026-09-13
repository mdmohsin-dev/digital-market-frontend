export type CouponType = "percentage" | "fixed";

export interface Coupon {
    id: string;
    code: string;
    type: CouponType;
    value: number;
    minimumOrder: number;
    expiresAt: string;
    active: boolean;
}

export const coupons: Coupon[] = [
    {
        id: "coupon_001",
        code: "MOHSIN30",
        type: "percentage",
        value: 30,
        minimumOrder: 500,
        expiresAt: "2026-12-31T23:59:59+06:00",
        active: true,
    }
];

export const findCouponByCode = (
    code: string
): Coupon | null => {
    const normalizedCode = code.trim().toUpperCase();

    return (
        coupons.find(
            (coupon) => coupon.code === normalizedCode
        ) ?? null
    );
};

export const calculateCouponDiscount = (
    coupon: Coupon,
    subtotal: number
): number => {
    if (subtotal < coupon.minimumOrder) {
        return 0;
    }

    if (coupon.type === "percentage") {
        return Math.min(
            Math.round(
                (subtotal * coupon.value) / 100
            ),
            subtotal
        );
    }

    return Math.min(coupon.value, subtotal);
};