import ProductCard from "@/components/Product/ProductCard"
import { products } from "@/Data/products"


const ShopPage = () => {
    return (
        <div className="grid grid-cols-5 gap-8 mt-16">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    )
}

export default ShopPage