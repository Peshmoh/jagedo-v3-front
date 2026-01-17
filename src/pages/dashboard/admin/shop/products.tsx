/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Plus,
    Search,
    Download,
    Edit,
    Trash2,
    Eye,
    Calendar,
    X,
    Check,
    Package
} from "lucide-react";
import { toast } from "react-hot-toast";
import AddProductForm from "./AddProductForm";
import {
    getAllProducts,
    approveProduct,
    deleteProduct as deleteProductAPI
} from "@/api/products.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";

interface Price {
    regionId: number;
    regionName: string;
    price: number;
}

interface Product {
    id: number;
    name: string;
    description: string;
    type: string;
    category: string;
    basePrice: number | null;
    pricingReference: string | null;
    lastUpdated: string | null;
    bId: string | null;
    sku: string | null;
    material: string | null;
    size: string | null;
    color: string | null;
    uom: string | null;
    custom: boolean;
    images: string[] | null;
    customPrice: number | null;
    createdAt: string;
    updatedAt: string;
    active: boolean;
    prices: Price[];
}

export default function ShopProducts() {
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("HARDWARE");
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [showProductModal, setShowProductModal] = useState(false);

    // Main category tabs with correct mapping
    const categories = [
        { id: "HARDWARE", label: "Hardware", type: "HARDWARE" },
        { id: "CUSTOM_PRODUCTS", label: "Custom Products", type: "FUNDI" },
        { id: "DESIGNS", label: "Designs", type: "PROFESSIONAL" },
        { id: "HIRE_MACHINERY", label: "Hire Machinery & E", type: "CONTRACTOR" }
    ];

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts(axiosInstance);
            if (response.success) {
                setProducts(response.hashSet);
            } else {
                toast.error("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    // Handle edit product
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setShowAddProduct(true);
    };

    // Handle view product details
    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    // Delete product
    const deleteProduct = async (productId: number) => {
        try {
            await deleteProductAPI(axiosInstance, productId);
            toast.success("Product deleted successfully");
            fetchProducts(); // Refresh the list
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };


    const handleApproveProduct = async (productId: number) => {
        try {
            await approveProduct(axiosInstance, productId);
            toast.success("Product deleted successfully");
            fetchProducts(); // Refresh the list
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    console.log("Products: ", products);

    const selectedCategoryType = categories.find(cat => cat.id === selectedCategory)?.type || "HARDWARE";

    // Filter products based on search term and category
    const filteredProducts = products?.filter((product) => {
        const matchesSearch =
            product?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            (product?.sku?.toLowerCase() || "").includes(searchTerm?.toLowerCase()) ||
            (product?.bId?.toLowerCase() || "").includes(searchTerm?.toLowerCase()) ||
            (product?.basePrice?.toString() || "").includes(searchTerm) ||
            (product?.pricingReference?.toLowerCase() || "").includes(searchTerm?.toLowerCase()) ||
            (product.active ? "active" : "inactive").includes(
                searchTerm.toLowerCase()
            );

        const matchesCategory = product.type === selectedCategoryType;

        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES"
        }).format(price);
    };

    // Get the lowest price from the prices array
    const getLowestPrice = (product: Product) => {
        if (product.prices && product.prices.length > 0) {
            const minPrice = Math.min(...product.prices.map(p => p.price));
            return minPrice;
        }
        return product.basePrice || 0;
    };

    // Get the highest price from the prices array
    const getHighestPrice = (product: Product) => {
        if (product.prices && product.prices.length > 0) {
            const maxPrice = Math.max(...product.prices.map(p => p.price));
            return maxPrice;
        }
        return product.basePrice || 0;
    };

    // If showing add product form, render it
    if (showAddProduct) {
        return (
            <AddProductForm
                onBack={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                }}
                onSuccess={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                    fetchProducts();
                }}
                product={editingProduct}
                isEditMode={!!editingProduct}
            />
        );
    }

    // Product Detail Modal Component (UI Layout Fix)
    const ProductDetailModal = ({
        product,
        isOpen,
        onClose
    }: {
        product: Product | null;
        isOpen: boolean;
        onClose: () => void;
    }) => {
        if (!product) return null;

        // A simple, stateless helper for consistent styling
        const DetailItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
            <div>
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="mt-1 text-gray-900">{children}</dd>
            </div>
        );

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-6 sm:p-8 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-gray-900">
                            {product.name}
                        </DialogTitle>
                        <DialogDescription className="pt-1">
                            SKU: {product.sku || 'N/A'} | BID: {product.bId || 'N/A'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mt-6">
                        {/* Left Column: Images */}
                        <div className="md:col-span-1 space-y-4">
                            {product.images && product.images.length > 0 ? (
                                <>
                                    {/* Main Image */}
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                        <img
                                            src={product.images[0]}
                                            alt={`${product.name} - Primary`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Thumbnails */}
                                    {product.images.length > 1 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {product.images.slice(1).map((image, index) => (
                                                <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden border">
                                                    <img
                                                        src={image}
                                                        alt={`${product.name} - Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center p-4">
                                    <Package className="h-10 w-10 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">No Images</p>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Details */}
                        <div className="md:col-span-2 space-y-6">
                            <section>
                                <p className="text-gray-700">{product.description || "No description available."}</p>
                            </section>

                            <div className="border-t"></div>

                            <section>
                                <h3 className="text-base font-semibold text-gray-800 mb-3">Product Details</h3>
                                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    <DetailItem label="Category">{product.category}</DetailItem>
                                    <DetailItem label="Type">{product.type}</DetailItem>
                                    {product.material && <DetailItem label="Material">{product.material}</DetailItem>}
                                    {product.size && <DetailItem label="Size">{product.size}</DetailItem>}
                                    {product.color && <DetailItem label="Color">{product.color}</DetailItem>}
                                    {product.uom && <DetailItem label="Unit of Measure">{product.uom}</DetailItem>}
                                </dl>
                            </section>

                            <div className="border-t"></div>

                            <section>
                                <h3 className="text-base font-semibold text-gray-800 mb-3">Pricing Information</h3>
                                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    <DetailItem label="Base Price">
                                        <span className="font-semibold text-lg">{product.basePrice ? formatPrice(product.basePrice) : "Not set"}</span>
                                    </DetailItem>
                                    <DetailItem label="Pricing Reference">{product.pricingReference || "Not set"}</DetailItem>
                                    {product.customPrice && (
                                        <DetailItem label="Custom Price">
                                            <span className="font-semibold text-lg text-blue-600">{formatPrice(product.customPrice)}</span>
                                        </DetailItem>
                                    )}
                                </dl>
                                {product.prices && product.prices.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Regional Prices</h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2 border rounded-md p-2 bg-gray-50/50">
                                            {product.prices.map((price, index) => (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <span className="font-medium text-gray-700">{price.regionName}</span>
                                                    <span className="font-semibold">{formatPrice(price.price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            <div className="border-t"></div>

                            <section>
                                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    <DetailItem label="Status">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant={product.active ? "default" : "secondary"}>{product.active ? "Active" : "Inactive"}</Badge>
                                            <Badge variant={product.custom ? "default" : "outline"}>{product.custom ? "Custom" : "Standard"}</Badge>
                                        </div>
                                    </DetailItem>
                                    <DetailItem label="Timestamps">
                                        <div className="text-sm">Created: {new Date(product.createdAt).toLocaleDateString('en-GB')}</div>
                                        <div className="text-sm">Updated: {new Date(product.updatedAt).toLocaleDateString('en-GB')}</div>
                                    </DetailItem>
                                </dl>
                            </section>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                onClose();
                                handleEditProduct(product);
                            }}
                            className="bg-[#00007A] hover:bg-[#00007A]/90 text-white"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Product
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Products
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all shop products, inventory, and pricing.
                    </p>
                </div>
            </div>

            {/* Main Category Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedCategory === category.id
                            ? "bg-[#00007A] text-white"
                            : "bg-transparent text-blue-600 hover:bg-blue-50"
                            }`}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-2 bg-white border-none">
                <div className="relative flex-1 border-none">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Name, SKU, BID, Price, Status"
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Import File
                </Button>
                <Button
                    onClick={() => setShowAddProduct(true)}
                    style={{ backgroundColor: "#00007A", color: "white" }}
                >
                    <Plus className="mr-2 h-4 w-4" />Add Product
                </Button>
            </div>

            {/* Products Table */}
            <Card className="bg-white border-none shadow-md">
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>
                        Manage all products in the shop app
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-muted-foreground">
                                Loading products...
                            </div>
                        </div>
                    ) : filteredProducts?.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-muted-foreground">
                                No products found for this category.
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-md border border-gray-200 shadow-md p-6">
                            <Table className="b">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            No
                                        </TableHead>
                                        <TableHead className="w-20">
                                            Thumbnail
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Price Range (KES)</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>BID</TableHead>
                                        <TableHead className="w-32">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts?.map((product, index) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    {product.images &&
                                                        product.images.length >
                                                        0 ? (
                                                        <img
                                                            src={
                                                                product
                                                                    .images[0]
                                                            }
                                                            alt={product.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="text-gray-400 text-xs">
                                                            No img
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {product.category}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {product.prices && product.prices.length > 0 ? (
                                                        <div>
                                                            <div>{formatPrice(getLowestPrice(product))}</div>
                                                            {getLowestPrice(product) !== getHighestPrice(product) && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    - {formatPrice(getHighestPrice(product))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : product.basePrice ? (
                                                        formatPrice(product.basePrice)
                                                    ) : (
                                                        "Not set"
                                                    )}
                                                </div>
                                                {product.customPrice && (
                                                    <div className="text-sm text-muted-foreground">
                                                        Custom:{" "}
                                                        {formatPrice(
                                                            product.customPrice
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {product.sku || "Not set"}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {product.bId || "Not set"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewProduct(product)}
                                                    >
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleEditProduct(product)}
                                                        style={{
                                                            backgroundColor: "#00007A",
                                                            color: "white"
                                                        }}
                                                    >
                                                        <Edit className="h-3 w-3 mr-1" />
                                                        Edit
                                                    </Button>

                                                    {/* Single Toggle Button */}
                                                    <Button
                                                        size="sm"
                                                        onClick={() => product.active ? handleApproveProduct(product.id) : handleApproveProduct(product.id)}
                                                        style={{
                                                            backgroundColor: product.active ? "#f59e0b" : "#10b981",
                                                            color: "white"
                                                        }}
                                                    >
                                                        {product.active ? (
                                                            <>
                                                                <X className="h-3 w-3 mr-1" />
                                                                Disapprove
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Check className="h-3 w-3 mr-1" />
                                                                Approve
                                                            </>
                                                        )}
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        onClick={() => deleteProduct(product.id)}
                                                        style={{
                                                            backgroundColor: "#dc2626",
                                                            color: "white"
                                                        }}
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                        Rows per page:
                    </span>
                    <select className="border rounded px-2 py-1 text-sm">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                        Prev
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page 1 of 0
                    </span>
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                </div>
            </div>

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={showProductModal}
                onClose={() => {
                    setShowProductModal(false);
                    setSelectedProduct(null);
                }}
            />
        </div>
    );
}
