import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiOutlinePaperClip } from "react-icons/ai";
import { FaVideo, FaTrash, FaFileAlt } from "react-icons/fa";
import { getProvierOrderRequestsById } from "@/api/orderRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import Loader from "../Loader";

interface FileObject {
  name: string;
  raw: File | null; // Can be a File object or null for pre-existing (if API supported it)
}

const Submissions = () => {
  const { id } = useParams<{ id: string }>();
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
  
  const [adminNotes, setAdminNotes] = useState<string>("");

  const [fileName, setFileName] = useState<string>("");
  const [files, setFiles] = useState<FileObject[]>([]);

  // State for data fetching lifecycle
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
    }

    const fetchOrderNotes = async () => {
      try {
        setLoading(true);
        const response = await getProvierOrderRequestsById(axiosInstance, id);
        if (response && response.success) {
          setAdminNotes(response.data.notes || ""); // Set notes from API, with a fallback
          // NOTE: The file list starts empty as the API does not provide attachments.
        } else {
          throw new Error(response.message || "Failed to fetch order details.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        console.error("Error fetching order notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderNotes();
  }, [id]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fileName.trim()) {
      alert("Please enter a file name before uploading.");
      return;
    }
    if (!event.target.files) return;

    const uploadedFiles = Array.from(event.target.files);
    const newFiles = uploadedFiles.map((file) => ({
      name: fileName || file.name, // Use entered name, fallback to original
      raw: file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setFileName(""); // Clear the input field after upload
    event.target.value = ''; // Reset the file input
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden sm:block">
        <br />
        <br />
      </div>
      <div className="block sm:hidden pt-4"></div>

      <div className="min-h-screen bg-gray-100 py-3 sm:py-6 px-2 sm:px-4 flex justify-center">
        <div className="max-w-6xl w-full bg-white shadow-md rounded-md p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-700 px-1 sm:px-0">
            Attachments
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 border border-gray-200 p-3 sm:p-4 md:p-6 rounded-md">
            {/* Text Area */}
            <div className="md:col-span-2 order-1 md:order-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:hidden">
                Order Description
              </label>
              <textarea
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-md text-sm sm:text-base resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                placeholder="Enter order description..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>

            {/* File Upload Section */}
            <div className="md:col-span-2 space-y-3 order-2 md:order-2">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 sm:hidden">
                  File Upload
                </label>
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg p-2 sm:p-3">
                  <input
                    type="text"
                    placeholder="Enter file name"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-md outline-none bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
                  />
                  <div className="flex gap-2 justify-center xs:justify-start">
                    <label
                      className={`cursor-pointer p-2 rounded-md transition-colors ${!fileName.trim() ? "opacity-50 cursor-not-allowed bg-gray-200" : "bg-blue-50 hover:bg-blue-100"}`}
                      title={!fileName.trim() ? "Enter a file name first" : "Upload file"}
                    >
                      <AiOutlinePaperClip className="text-xl sm:text-2xl text-gray-700" />
                      <input type="file" className="hidden" onChange={handleFileUpload} multiple disabled={!fileName.trim()} />
                    </label>
                    <label
                      className={`cursor-pointer p-2 rounded-md transition-colors ${!fileName.trim() ? "opacity-50 cursor-not-allowed bg-gray-200" : "bg-red-50 hover:bg-red-100"}`}
                      title={!fileName.trim() ? "Enter a file name first" : "Upload video"}
                    >
                      <FaVideo className="text-lg sm:text-xl text-red-500" />
                      <input type="file" className="hidden" onChange={handleFileUpload} multiple accept="video/*" disabled={!fileName.trim()} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="min-h-32 sm:min-h-40 bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-200">
                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-24 sm:h-32 text-center text-gray-500">
                    <FaFileAlt className="text-2xl sm:text-3xl mb-2 mx-auto" />
                    <p className="text-sm sm:text-base">No files uploaded</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Uploaded Files ({files.length}):
                    </h3>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li key={index} className="flex justify-between items-center bg-white px-2 sm:px-3 py-2 rounded shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <span className="text-gray-800 text-xs sm:text-sm truncate pr-2 flex-1">
                            {file.name}
                          </span>
                          <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0" title="Remove file">
                            <FaTrash className="text-sm" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Submissions;