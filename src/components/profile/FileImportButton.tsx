// src/components/FileImportButton.js

// 1. Accept the `onImportClick` function as a prop
const FileImportButton = ({ onImportClick }) => {
  return (
    <button
      type="button"
      // 2. Call the passed-in function when clicked
      onClick={onImportClick}
      className="border border-gray-300 bg-white text-gray-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-100 transition duration-300 inline-flex items-center gap-2 shadow-sm"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      Import
    </button>
  );
};

export default FileImportButton;