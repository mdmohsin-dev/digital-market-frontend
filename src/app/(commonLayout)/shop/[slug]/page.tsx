import { products } from "@/Data/products";
import ProductDetails from "@/components/Product/ProductDetails";
import { notFound } from "next/navigation";

interface ProductDetailsPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductDetailsPage({
    params,
}: ProductDetailsPageProps) {
    const { slug } = await params;

    const product = products.find(
        (product) => product.slug === slug
    );

    if (!product) {
        notFound();
    }

    return <ProductDetails product={product} />;
}