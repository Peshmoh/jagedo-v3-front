//@ts-nocheck
import { useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import ParsedPreviewTable from "./ParsedPreviewTable";

interface FileUploadPageProps {
  onBack: () => void;
}

export default function FileUploadPage({ onBack }: FileUploadPageProps) {
  const [files, setFiles] = useState([]);
  const [templateDownloaded, setTemplateDownloaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const expectedHeaders = [
    "Number", "Thumbnail", "Product Name", "Product Description", "Price",
    "SKU", "BID", "Material", "Size", "Color", "Region", "UOM"
  ];

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTemplateDownload = () => {
    setTemplateDownloaded(true);
    toast.success("Template downloaded! You can now upload your file.");
  };

  const isValidFile = (file) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "text/csv", // .csv
    ];
    return file && allowedTypes.includes(file.type);
  };

  // --- THIS FUNCTION IS CORRECTED ---
  const validateFileStructure = async (file) => {
    try {
      // 1. Get the raw binary data from the file.
      const data = await file.arrayBuffer();

      // 2. Tell XLSX.read() to parse the data as a binary "array". This is the crucial part.
      const workbook = XLSX.read(data, { type: "array" });
      
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!jsonData || jsonData.length === 0) {
        return false; // Handle empty files
      }

      const headers = jsonData[0]?.map((h) => String(h).trim());
      const isValid = expectedHeaders.every((h, i) => headers[i] === h);

      return isValid;
    } catch (error) {
      // This is where the error you saw was being caught.
      console.error("File validation error:", error);
      return false;
    }
  };
  // --- END OF CORRECTION ---

  const handleFiles = async (selectedFiles) => {
    const file = selectedFiles[0];
    if (!isValidFile(file)) {
      toast.error("Invalid file type. Only .xlsx and .csv files are allowed.");
      return;
    }

    const isValidStructure = await validateFileStructure(file);
    if (!isValidStructure) {
      toast.error("File structure or headers do not match the required template.");
      return;
    }

    setFiles([file]); // Set only the single, validated file
    setShowPreview(true);
    toast.success("File uploaded successfully! Please review the data.");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleBrowse = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };
  
  const handleReset = () => {
    setFiles([]);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
      {showPreview && files.length > 0 ? (
        <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <button 
                    onClick={onBack}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                    Back
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Preview Imported Data</h2>
                <button 
                    onClick={handleReset}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                    Upload Another File
                </button>
            </div>
            <ParsedPreviewTable file={files[0]} />
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-8 bg-white w-full max-w-xl text-center"
          onDrop={templateDownloaded ? handleDrop : preventDefaults}
          onDragOver={preventDefaults}
          onDragEnter={preventDefaults}
          onDragLeave={preventDefaults}
        >
          <button 
              onClick={onBack}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
              Back
          </button>
          <p className="text-gray-600 mb-2">Drag and drop your file here.</p>
          <p className="text-gray-500 mb-4">- or -</p>

          <label
            className={`inline-block px-4 py-2 rounded text-white ${
              templateDownloaded
                ? "bg-[rgb(0,0,112)] hover:bg-blue-200 hover:text-gray-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Browse
            <input
              type="file"
              multiple={false} // Only allow one file at a time
              disabled={!templateDownloaded}
              onChange={handleBrowse}
              className="hidden"
              accept=".xlsx,.csv"
            />
          </label>

          <div className="mt-4 space-x-4">
            <a href="/product-template.xlsx" download
                className="text-sm border-none cursor-pointer px-4 py-3 bg-[rgb(0,0,112)] text-white hover:bg-blue-300 hover:text-gray-700 rounded inline-block"
                onClick={handleTemplateDownload}
            >
                Download Template
            </a>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            You can import records through an .xlsx or .csv file.
          </p>
        </div>
      )}
    </div>
  );
}