import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductUploadForm from "./ProductUploadForm";
import FileImportButton from "./FileImportButton";
import FileUploadPage from "./FileImportPreview.tsx";
import { getProductsBySeller, deleteProduct } from "@/api/products.api";
import { ShoppingBagIcon, LockClosedIcon, PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useGlobalContext } from '@/context/GlobalProvider';
import useAxiosWithAuth from '@/utils/axiosInterceptor';
import Loader from '../Loader';
import { toast } from 'react-hot-toast';

const ShopAppPage = ({ data: profileData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState('default');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useGlobalContext();
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

  const fetchSellerProducts = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const response = await getProductsBySeller(axiosInstance, user.id);
      setProducts(response.hashSet || []);
    } catch (error) {
      console.error("Failed to fetch seller products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'default') {
      fetchSellerProducts();
    }
  }, [currentView, user?.id]);

  // Handlers to change the view
  const showCreateView = () => {
    navigate('?'); // Clear any edit params
    setCurrentView('create');
  };
  const showImportView = () => setCurrentView('import');
  const showDefaultView = () => {
    navigate('?'); // Clear params when returning
    setCurrentView('default');
  };

  const handleEdit = (productId: string) => {
    navigate(`?edit=true&id=${productId}`);
    setCurrentView('create'); // ProductUploadForm handles both modes
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      await deleteProduct(axiosInstance, productId);
      toast.success("Product deleted successfully");
      fetchSellerProducts(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const viewTitles = {
    default: 'Manage Product Catalog',
    create: 'Add a New Product',
    import: 'Batch Import Products'
  };

  const isApproved = profileData?.status == 'VERIFIED' === true;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return <ProductUploadForm onCancel={showDefaultView} />;

      case 'import':
        return <FileUploadPage onBack={showDefaultView} />;

      case 'default':
      default:
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                {isApproved ? (
                  <>
                    <div className="w-full space-y-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-black text-gray-900 leading-tight">
                            Product Inventory
                          </h2>
                          <p className="text-gray-500 text-sm font-medium">
                            Manage your listings and keep your catalog up to date.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                          <button
                            type='button'
                            onClick={showCreateView}
                            className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-100 hover:bg-indigo-700 flex items-center justify-center gap-2 transform active:scale-95 flex-1 md:flex-none"
                          >
                            <PlusIcon className="w-5 h-5" />
                            Add Product
                          </button>
                          <FileImportButton onImportClick={showImportView} />
                        </div>
                      </div>

                      {isLoading ? (
                        <div className="flex justify-center py-20">
                          <Loader />
                        </div>
                      ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {products.map((product: any) => (
                            <div key={product.id} className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                              <div className="aspect-square bg-white relative overflow-hidden">
                                {product.images && product.images[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBagIcon className="w-12 h-12 text-gray-200" />
                                  </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleEdit(product.id)}
                                    className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-gray-600 hover:text-indigo-600 transition-colors"
                                  >
                                    <PencilSquareIcon className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-gray-600 hover:text-red-600 transition-colors"
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                              <div className="p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-bold text-gray-900 truncate flex-1">{product.name}</h3>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${product.active ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                    {product.active ? 'Active' : 'Pending'}
                                  </span>
                                </div>
                                <p className="text-gray-500 text-xs line-clamp-2 min-h-[2rem]">
                                  {product.description}
                                </p>
                                <div className="pt-2 flex justify-between items-center border-t border-gray-100">
                                  <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</p>
                                    <p className="text-indigo-600 font-black">KES {parseFloat(product.customPrice || product.basePrice || 0).toLocaleString()}</p>
                                  </div>
                                  <div className="text-right space-y-0.5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU</p>
                                    <p className="text-xs font-mono text-gray-600">{product.sku || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-20 text-center space-y-4">
                          <div className="p-4 bg-white rounded-2xl shadow-sm">
                            <ShoppingBagIcon className="w-12 h-12 text-gray-300" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-gray-900">Your Catalog is Empty</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto">Start by adding your first product listing to reach more customers on Jagedo.</p>
                          </div>
                          <button
                            onClick={showCreateView}
                            className="text-indigo-600 font-bold text-sm hover:underline"
                          >
                            Create your first listing →
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="max-w-xl mx-auto space-y-6">
                    <div className="inline-flex p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                      <LockClosedIcon className="w-10 h-10 text-yellow-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">
                      Verify Your Account to Start Selling
                    </h2>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                      Your store functionality is currently restricted. Once our team approves your profile and professional experience,
                      you will be able to upload products and manage your digital storefront.
                    </p>
                    <div className="pt-4">
                      <div className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Awaiting Documentation Approval
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-inter">
          {viewTitles[currentView]}
        </h1>
      </div>
      {renderCurrentView()}
    </div>
  );
}

export default ShopAppPage;