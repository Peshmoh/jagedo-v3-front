/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import HeroSection from "@/components/shop/HeroSection";
import CategoryTabs from "@/components/shop/CategoryTabs";
import LocationDropdown from "@/components/shop/LocationDropdown";
import Sidebar from "@/components/shop/SideBar";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductCard from "@/components/shop/ProductCard";
import Loader from "@/components/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useProducts, Product } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";

const ITEMS_PER_PAGE = 12;
const INITIAL_FILTERS = ["All Products"];
const ALL_REGIONS = "All Regions";

// THIS IS THE BEST WAY TO MANAGE THE LOGIC
const CATEGORIES_WITHOUT_LOCATION_FILTER = ['custom', 'designs'];

const CATEGORY_MAPPINGS: Record<string, string[]> = {
  hardware: ["Cement", "Pipes and Fittings", "Reinforcement Bars", "Steel", "Aluminum", "Glass", "HARDWARE"],
  custom: ["Custom Products", "Windows", "Doors", "Gates", "FUNDI"],
  equipment: ["Equipment", "Machinery", "Tools", "CONTRACTOR"],
  designs: ["Plans", "Designs", "PROFESSIONAL"],
};

const ShopApp = () => {
  const [activeCategory, setActiveCategory] = useState("hardware");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(INITIAL_FILTERS);
  const [selectedLocationName, setSelectedLocationName] = useState<string>(ALL_REGIONS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const { data: products = [], isLoading, error } = useProducts();
  const { addToCart } = useCart();

  useEffect(() => {
    setSelectedFilters(INITIAL_FILTERS);
    setCurrentPage(1);
    setSelectedLocationName(ALL_REGIONS);
  }, [activeCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, selectedLocationName]);

  const handleLocationSelect = useCallback((locationName: string) => {
    setSelectedLocationName(locationName);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    let workingProductList = products;

    if (selectedLocationName && selectedLocationName !== ALL_REGIONS) {
      workingProductList = workingProductList.filter(product =>
        product.custom || product.regionName === selectedLocationName
      );
    }

    const primaryCategoryFilters = CATEGORY_MAPPINGS[activeCategory] || [];
    let productsInActiveCategory = workingProductList.filter(product =>
      primaryCategoryFilters.some(cat =>
        product.type.toLowerCase().includes(cat.toLowerCase())
      )
    );

    const activeSidebarFilters = selectedFilters.filter(f => f !== "All Products");
    if (activeSidebarFilters.length > 0) {
      productsInActiveCategory = productsInActiveCategory.filter(product =>
        activeSidebarFilters.some(filter =>
          product.type.toLowerCase().includes(filter.toLowerCase()) ||
          product.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    return productsInActiveCategory;
  }, [products, activeCategory, selectedFilters, selectedLocationName]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleFilterChange = (filter: string, isChecked: boolean) => {
    if (filter === "All Products" && isChecked) {
      setSelectedFilters(INITIAL_FILTERS);
      return;
    }

    setSelectedFilters(currentFilters => {
      const otherFilters = currentFilters.filter(f => f !== "All Products");
      const newFilters = isChecked
        ? [...otherFilters, filter]
        : otherFilters.filter(f => f !== filter);

      return newFilters.length === 0 ? INITIAL_FILTERS : newFilters;
    });
  };

  const handlePageChange = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  const handleProductClick = (product: Product) => setSelectedProduct(product);
  const handleBackToGrid = () => setSelectedProduct(null);

  const handleAddToCartAndNavigate = (product: Product) => {
    const result = addToCart(product);
    if (result.success) {
      toast.success(`${product.name} added to cart!`);
      navigate("/customer/cart");
    } else {
      toast.error(result.message);
    }
  };

  const handleGridAddToCartAndNavigate = (product: Product) => {
    const result = addToCart(product);
    if (result.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(result.message);
    }
  };

  const handleBuyNow = (product: Product) => {
    const result = addToCart(product);
    if (result.success) {
      toast.success(`Proceeding to checkout for ${product.name}`);
      navigate("/customer/checkout");
    } else {
      toast.error(result.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Products</h2>
          <p className="text-muted-foreground">We couldn't load the products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div className="flex">
        <aside className="hidden md:block w-80 bg-white p-6 border-none min-h-screen sticky top-0">
          {!CATEGORIES_WITHOUT_LOCATION_FILTER.includes(activeCategory) && (
            <LocationDropdown
              selectedLocationName={selectedLocationName}
              onSelectLocation={handleLocationSelect}
            />
          )}
          <Sidebar
            category={activeCategory}
            filters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <main className="flex-1 bg-white p-6">
          {selectedProduct ? (
            <div>
              <button onClick={handleBackToGrid} className="mb-6 text-jagedo-blue hover:underline">
                ← Back to products
              </button>
              <ProductCard
                product={selectedProduct}
                isDetailView={true}
                onProductClick={() => { }}
                onAddToCart={() => handleAddToCartAndNavigate(selectedProduct!)}
                onBuyNow={() => handleBuyNow(selectedProduct!)}
              />
            </div>
          ) : (
            <>
              <ProductGrid
                products={paginatedProducts}
                onProductClick={handleProductClick}
                onAddToCart={handleGridAddToCartAndNavigate}
              />

              {paginatedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found for the selected filters.</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center py-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => handlePageChange(e, Math.max(currentPage - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => handlePageChange(e, page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => handlePageChange(e, Math.min(currentPage + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopApp;