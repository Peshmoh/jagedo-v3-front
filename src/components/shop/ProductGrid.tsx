import { Product } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

// 1. Update the props to include `onAddToCart`
interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

// 2. Accept `onAddToCart` as a prop and REMOVE the useCart() hook
const ProductGrid = ({ products, onProductClick, onAddToCart }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 border-none">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          // 3. Pass the functions it received directly to the child
          onProductClick={() => onProductClick(product)}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;