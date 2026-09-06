export interface FlashSale {
    id: string;
    title: string;
    startAt: string;
    endAt: string;
    productIds: string[];
}

export const flashSales: FlashSale[] = [
    {
        id: "flash_001",
        title: "Summer Flash Sale",
        startAt: "2026-09-06T00:00:00+06:00",
        endAt: "2026-09-14T00:00:00+06:00",
        productIds: [
            "prod_001",
            "prod_002",
            "prod_003",
            "prod_004",
            "prod_005",
            "prod_006",
        ],
    },
];