import { useState } from 'react';
import ProductUploadForm from "./ProductUploadForm";
import FileImportButton from "./FileImportButton";
import FileUploadPage from "./FileImportPreview.tsx";

const ShopAppPage = () => {
  const [currentView, setCurrentView] = useState('default');
  const userData = localStorage.getItem("user");

  const user = JSON.parse(userData ? userData : "{}");

  // Handlers to change the view
  const showCreateView = () => setCurrentView('create');
  const showImportView = () => setCurrentView('import');
  const showDefaultView = () => setCurrentView('default');

  const viewTitles = {
    default: 'Products',
    create: 'Add a New Product',
    import: 'Import Products from File'
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return <ProductUploadForm onCancel={showDefaultView} />;
      
      case 'import':
        return <FileUploadPage onBack={showDefaultView} />;

      case 'default':
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* RESPONSIVE CHANGE: Adjusted padding for different screen sizes */}
            <div className="p-6 md:p-8">
              {/* NOTE: The existing flex-col md:flex-row is already a great responsive pattern! */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                {user?.adminApproved ? (<div>
                  {/* RESPONSIVE CHANGE: Adjusted font size for readability */}
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                    Start Building Your Product Catalog
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Create a compelling product collection that showcases your best items. Add detailed descriptions, high-quality images, and competitive pricing to attract more customers.
                  </p>
                  {/*
                    RESPONSIVE CHANGE: 
                    - `flex-col sm:flex-row`: Stacks buttons vertically on small screens, and horizontally on screens small and up.
                    - `items-start`: Ensures buttons align to the left when stacked.
                  */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 mt-5">
                    <button
                      type='button'
                      onClick={showCreateView}
                      className="bg-[rgb(0,0,122)] text-white cursor-pointer hover:bg-blue-200 hover:text-black font-semibold px-6 py-2.5 rounded-lg transition duration-300 inline-flex items-center justify-center gap-2 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Product
                    </button>
                    <div>
                      <FileImportButton onImportClick={showImportView} />
                    </div>
                  </div>
                </div>) : (
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                      Your account is not approved
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Once Approved, you will be able to add products to your catalog.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    // RESPONSIVE CHANGE: Adjusted padding for different screen sizes
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Main Content Section */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          {/* RESPONSIVE CHANGE: Adjusted heading font size */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {viewTitles[currentView]}
          </h1>
        </div>
        
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default ShopAppPage;