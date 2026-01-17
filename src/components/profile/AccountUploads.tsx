/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Download, UploadCloud, FileText, X } from "lucide-react";
import { getProviderProfile } from "@/api/provider.api";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  uploadCustomerDocuments,
  uploadContractorDocuments,
  uploadFundiDocuments,
  uploadProfessionalDocuments,
  uploadHardwareDocuments,
  uploadIndivudualCustomerDocuments
} from "@/api/uploads.api";
import { uploadFile } from "@/utils/fileUpload";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { toast } from "react-hot-toast";

const FileUpload = ({ label, file, setFile, handleDrop, isReadOnly, onDelete }) => {
  const [dragging, setDragging] = useState(false);
  const isUrl = typeof file === 'string' && file.startsWith('http');
  const isFileObject = file instanceof File;

  const getFileName = () => {
    if (isFileObject) return file.name;
    if (isUrl) {
      try {
        return new URL(file).pathname.split('/').pop();
      } catch (e: any) {
        console.log("Error: ", e)
        return "document.link";
      }
    }
    return null;
  };
  const fileName = getFileName();

  const handleDragOver = (e) => { e.preventDefault(); if (!isReadOnly) setDragging(true); };
  const handleDragLeave = () => { setDragging(false); };
  const handleFileChange = (e) => { if (e.target.files.length > 0 && !isReadOnly) setFile(e.target.files[0]); };

  const handleRemoveFile = async () => {
    if (!isReadOnly) {
      if (isUrl && onDelete) {
        await onDelete();
      } else {
        setFile(null);
      }
    }
  };

  const handleDropWrapper = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!isReadOnly) {
      handleDrop(e, setFile);
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <label className="block text-sm font-medium">{label} {!fileName && !isReadOnly && <span className="text-red-500">*</span>}</label>
      {fileName ? (
        <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-gray-500 flex-shrink-0" />
            <span className="truncate max-w-[200px] md:max-w-xs">{fileName}</span>
          </div>
          <div className="flex items-center gap-4">
            {isUrl && <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title="View/Download"><Download size={18} /></a>}
            {!isReadOnly && (
              <button onClick={handleRemoveFile} type="button" className="text-red-500 hover:text-red-700" title="Remove to upload new"><X size={20} /></button>
            )}
          </div>
        </div>
      ) : isReadOnly ? (
        <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-500 text-center">
          Document not provided.
        </div>
      ) : (
        <div className={`relative flex items-center justify-center w-full ${dragging ? "bg-blue-50" : ""}`} onDrop={handleDropWrapper} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-blue-600 cursor-pointer hover:bg-gray-50">
            <UploadCloud className="w-8 h-8 text-blue-600" />
            <span className="mt-2 text-sm text-gray-600 text-center">Drag & drop or click to upload</span>
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" disabled={isReadOnly} />
          </label>
        </div>
      )}
    </div>
  );
};
FileUpload.propTypes = {
  label: PropTypes.string.isRequired,
  file: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.string]),
  setFile: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
};

const AccountUploads = () => {
  const { user } = useGlobalContext();
  const userType = user?.userType?.toLowerCase();
  const isIndividualCustomer = user?.accountType?.toLowerCase() === "individual" && userType === "customer";
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
  const isReadOnly = (user?.adminApproved && ["PROFESSIONAL", "CONTRACTOR", "FUNDI", "HARDWARE", "CUSTOMER"].includes(user?.userType));

  const [kraPIN, setkraPIN] = useState(null);
  const [idFront, setIdFront] = useState(null);
  const [idFrontUrl, setIdFrontUrl] = useState(null);
  const [idBackUrl, setIdBackUrl] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [businessPermit, setBusinessPermit] = useState(null);
  const [certificateOfIncorporation, setCertificateOfIncorporation] = useState(null);
  const [businessRegistration, setBusinessRegistration] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [academicCertificate, setacademicCertificate] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);
  const [practiceLicense, setPracticeLicense] = useState(null);

  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const getUploadFields = () => {
    if (isIndividualCustomer) {
      return [
        { label: "ID Front", name: "idFrontUrl", profileKey: "idFrontUrl", file: idFrontUrl, setFile: setIdFrontUrl },
        { label: "ID Back", name: "idBackUrl", profileKey: "idBackUrl", file: idBackUrl, setFile: setIdBackUrl },
        { label: "KRA PIN", name: "kraPIN", profileKey: "kraPIN", file: kraPIN, setFile: setkraPIN },
      ];
    }

    const fieldMappings = {
      customer: [
        { label: "Business Permit", name: "businessPermit", profileKey: "businessPermit", file: businessPermit, setFile: setBusinessPermit },
        { label: "Certificate of Incorporation", name: "certificateOfIncorporation", profileKey: "certificateOfIncorporation", file: certificateOfIncorporation, setFile: setCertificateOfIncorporation },
        { label: "KRA PIN", name: "pinCertificate", profileKey: "kraPIN", file: kraPIN, setFile: setkraPIN },
      ],
      contractor: [
        { label: "Business Registration", name: "businessRegistration", profileKey: "businessRegistration", file: businessRegistration, setFile: setBusinessRegistration },
        { label: "Business Permit", name: "businessPermit", profileKey: "businessPermit", file: businessPermit, setFile: setBusinessPermit },
        { label: "KRA PIN", name: "kraPIN", profileKey: "kraPIN", file: kraPIN, setFile: setkraPIN },
        { label: "Company Profile", name: "companyProfile", profileKey: "companyProfile", file: companyProfile, setFile: setCompanyProfile },
      ],
      fundi: [
        { label: "ID Front", name: "idFront", profileKey: "idFrontUrl", file: idFront, setFile: setIdFront },
        { label: "ID Back", name: "idBack", profileKey: "idBackUrl", file: idBack, setFile: setIdBack },
        { label: "Certificate", name: "certificate", profileKey: "certificateUrl", file: certificate, setFile: setCertificate },
        { label: "KRA PIN", name: "kraPIN", profileKey: "kraPIN", file: kraPIN, setFile: setkraPIN },
      ],
      professional: [
        { label: "ID Front", name: "idFront", profileKey: "idFrontUrl", file: idFront, setFile: setIdFront },
        { label: "ID Back", name: "idBack", profileKey: "idBackUrl", file: idBack, setFile: setIdBack },
        { label: "Academics Certificate", name: "academicCertificate", profileKey: "academicCertificateUrl", file: academicCertificate, setFile: setacademicCertificate },
        { label: "CV", name: "cvUrl", profileKey: "cvUrl", file: cvUrl, setFile: setCvUrl },
        { label: "KRA PIN", name: "kraPIN", profileKey: "kraPIN", file: kraPIN, setFile: setkraPIN },
        { label: "Practice License", name: "practiceLicense", profileKey: "practiceLicense", file: practiceLicense, setFile: setPracticeLicense },
      ],
      hardware: [
        { label: "Business Registration", name: "businessRegistration", profileKey: "businessRegistration", file: businessRegistration, setFile: setBusinessRegistration },
        { label: "KRA PIN", name: "kraPIN", profileKey: "kraPIN", file: kraPIN, setFile: setkraPIN },
        { label: "Single Business Permit", name: "singleBusinessPermit", profileKey: "singleBusinessPermit", file: businessPermit, setFile: setBusinessPermit },
        { label: "Company Profile", name: "companyProfile", profileKey: "companyProfile", file: companyProfile, setFile: setCompanyProfile },
      ]
    };
    return fieldMappings[userType] || [];
  };

  const fieldsToUpload = getUploadFields();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userType) {
        setIsProfileLoading(false);
        return;
      }
      try {
        setIsProfileLoading(true);
        const response = await getProviderProfile(axiosInstance, user.id);

        if (response.success && response.data?.userProfile) {
          const profile = response.data.userProfile;
          fieldsToUpload.forEach(field => {
            const documentUrl = profile[field.profileKey];
            if (documentUrl) {
              field.setFile(documentUrl);
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        toast.error("Could not load your document profile.");
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfileData();
  }, [userType, isIndividualCustomer]);

  const handleDrop = (e, setFile) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) setFile(e.dataTransfer.files[0]);
  };

  const handleDeleteDocument = async (fieldName) => {
    const deletePromise = async () => {
      const payload = fieldsToUpload.reduce((acc, field) => {
        if (field.name === fieldName) {
          acc[field.name] = "";
        } else if (field.file && typeof field.file === 'string') {
          acc[field.name] = field.file;
        }
        return acc;
      }, {});

      let uploadFunction;
      if (isIndividualCustomer) {
        uploadFunction = uploadIndivudualCustomerDocuments;
      } else {
        uploadFunction = {
          customer: uploadCustomerDocuments,
          contractor: uploadContractorDocuments,
          fundi: uploadFundiDocuments,
          professional: uploadProfessionalDocuments,
          hardware: uploadHardwareDocuments,
        }[userType];
      }

      if (uploadFunction) {
        await uploadFunction(axiosInstance, payload);
      } else {
        throw new Error('Invalid user type for document deletion.');
      }
    };

    try {
      setIsUploading(true);
      await toast.promise(
        deletePromise(),
        {
          loading: 'Deleting document...',
          success: 'Document deleted successfully!',
          error: (error) => error.response?.data?.message || error.message || 'Failed to delete document.'
        }
      );
      const fieldToDelete = fieldsToUpload.find(f => f.name === fieldName);
      if (fieldToDelete) {
        fieldToDelete.setFile(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);
    setIsUploading(true);

    const uploadAction = async () => {
      const filesToUploadPromises = fieldsToUpload
        .filter(field => field.file instanceof File)
        .map(async (field) => {
          const uploadedFile = await uploadFile(field.file);
          return { key: field.name, value: uploadedFile.url };
        });

      const newlyUploadedFiles = await Promise.all(filesToUploadPromises);

      const payload = fieldsToUpload.reduce((acc, field) => {
        if (field.file) {
          const newlyUploaded = newlyUploadedFiles.find(f => f.key === field.name);
          if (newlyUploaded) {
            acc[field.name] = newlyUploaded.value;
          } else if (typeof field.file === 'string') {
            acc[field.name] = field.file;
          }
        }
        return acc;
      }, {});

      let uploadFunction;
      if (isIndividualCustomer) {
        uploadFunction = uploadIndivudualCustomerDocuments;
      } else {
        uploadFunction = {
          customer: uploadCustomerDocuments,
          contractor: uploadContractorDocuments,
          fundi: uploadFundiDocuments,
          professional: uploadProfessionalDocuments,
          hardware: uploadHardwareDocuments,
        }[userType];
      }

      if (uploadFunction) {
        await uploadFunction(axiosInstance, payload);
      } else {
        throw new Error('Invalid user type for document upload.');
      }
    };

    try {
      await toast.promise(
        uploadAction(),
        {
          loading: 'Uploading documents...',
          success: 'Documents updated successfully!',
          error: (error) => {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to upload documents.';
            setUploadError(errorMessage);
            return errorMessage;
          },
        }
      );
    } catch (error) {
      console.error('Upload process failed:', error);
    } finally {
      setIsUploading(false);
    }
  };


  const getUserTypeTitle = () => {
    if (isIndividualCustomer) {
      return 'Individual Customer Documents';
    }
    return userType ? `${userType.charAt(0).toUpperCase() + userType.slice(1)} Documents` : 'Required Documents';
  }

  if (isProfileLoading) {
    return (
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500">Loading your document profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-2">Manage {getUserTypeTitle()}</h2>
      <p className="text-gray-600 mb-6">Review your uploaded documents or upload any missing files.</p>

      {isReadOnly && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-200">
          Your profile has been approved. To update your documents, please contact support for assistance.
        </div>
      )}

      {uploadError && <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm">{uploadError}</div>}

      <form onSubmit={handleSubmit}>
        {fieldsToUpload.map(({ label, file, setFile, name }) => (
          <FileUpload
            key={label}
            label={label}
            file={file}
            setFile={setFile}
            handleDrop={handleDrop}
            isReadOnly={isReadOnly}
            onDelete={() => handleDeleteDocument(name)}
          />
        ))}
        {!isReadOnly && (
          <div className="mt-6 text-right">
            <button
              type="submit"
              disabled={isUploading}
              className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : `Save & Update Documents`}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AccountUploads;