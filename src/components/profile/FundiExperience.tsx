/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import { updateFundiExperience } from "@/api/experience.api";
import { uploadFile } from "@/utils/fileUpload";
import { getProviderProfile } from "@/api/provider.api";
import { useGlobalContext } from "@/context/GlobalProvider";
import useAxiosWithAuth from "@/utils/axiosInterceptor";

interface FundiAttachment {
  id: number;
  projectName: string;
  files: (File | string)[];
}

const requiredProjectsByGrade: { [key: string]: number } = {
  "G1: Master Fundi": 3,
  "G2: Skilled": 2,
  "G3: Semi-skilled": 1,
  "G4: Unskilled": 0,
};

const FundiExperience = () => {
  const { user } = useGlobalContext();
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [attachments, setAttachments] = useState<FundiAttachment[]>([
    { id: 1, projectName: "", files: [] },
    { id: 2, projectName: "", files: [] },
    { id: 3, projectName: "", files: [] },
  ]);
  const [grade, setGrade] = useState("");
  const [experience, setExperience] = useState("");
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [visibleProjectRows, setVisibleProjectRows] = useState(0);

  const isReadOnly = user?.adminApproved === true;

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await getProviderProfile(axiosInstance, user.id);
        if (response.success && response.data) {
          const data = response.data.userProfile;
          if (data.grade) setGrade(data.grade);
          if (data.experience) setExperience(data.experience);
          if (data.fundiEvaluation) setEvaluationResults(data.fundiEvaluation);
          if (data.previousJobPhotoUrls && data.previousJobPhotoUrls.length > 0) {
            const groupedProjects = data.previousJobPhotoUrls.reduce((acc, item) => {
              acc[item.projectName] = acc[item.projectName] || [];
              acc[item.projectName].push(item.fileUrl);
              return acc;
            }, {});
            const populatedAttachments = Object.entries(groupedProjects).map(([projectName, files], index) => ({
              id: index + 1,
              projectName: projectName,
              files: files as string[],
            }));
            while (populatedAttachments.length < 3) {
              populatedAttachments.push({ id: populatedAttachments.length + 1, projectName: "", files: [] });
            }
            setAttachments(populatedAttachments);
          }
        }
      } catch (error) {
        console.error("Failed to fetch fundi experience:", error);
        toast.error("Could not load your existing experience data.");
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchExperience();
  }, [user.id]);

  useEffect(() => {
    setVisibleProjectRows(requiredProjectsByGrade[grade] || 0);
  }, [grade]);

  const handleFileChange = (rowId: number, file: File | null) => {
    if (!file) return;
    setAttachments((prev) =>
      prev.map((item) =>
        item.id === rowId && item.files.length < 3
          ? { ...item, files: [...item.files, file] }
          : item
      )
    );
  };

  // **MODIFICATION**: This function now uses toast.promise and only updates state on success.
  const removeFile = async (rowId: number, fileIndex: number) => {
    const updatedAttachments = attachments.map((item) => {
      if (item.id === rowId) {
        const newFiles = [...item.files];
        newFiles.splice(fileIndex, 1);
        return { ...item, files: newFiles };
      }
      return item;
    });

    const deletePromise = async () => {
      const projectsWithData = updatedAttachments.filter((att) => att.projectName.trim() !== "" && att.files.length > 0);
      const allFilePromises = projectsWithData.flatMap(project =>
        project.files.map(file => {
          if (file instanceof File) return uploadFile(file).then(up => ({ projectName: project.projectName, fileUrl: up.url }));
          return Promise.resolve({ projectName: project.projectName, fileUrl: file });
        })
      );
      const previousJobPhotoUrls = await Promise.all(allFilePromises);
      await updateFundiExperience(axiosInstance, { skill: user.skills, grade, experience, previousJobPhotoUrls });
    };

    try {
      await toast.promise(
        deletePromise(),
        {
          loading: 'Deleting file...',
          success: 'File deleted successfully!',
          error: (error) => error.response?.data?.message || 'Failed to delete file.',
        }
      );
      // **IMPROVEMENT**: Only update the local state after the API call succeeds.
      setAttachments(updatedAttachments);
    } catch (error) {
      console.error("File deletion failed:", error);
      // Error is already handled by toast.promise
    }
  };


  const handleProjectNameChange = (rowId: number, name: string) => {
    setAttachments((prev) => prev.map((item) => item.id === rowId ? { ...item, projectName: name } : item));
  };

  // **MODIFICATION**: This function is refactored to use toast.promise for loading/success/error states.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReadOnly) {
      toast.error("Your approved profile cannot be modified.");
      return;
    }
    if (!grade || !experience) {
      toast.error("Please select a grade and your years of experience.");
      return;
    }

    const requiredProjects = requiredProjectsByGrade[grade] || 0;
    const submittedProjects = attachments
      .slice(0, requiredProjects)
      .filter(att => att.projectName.trim() !== "" && att.files.length > 0);

    if (submittedProjects.length < requiredProjects) {
      toast.error(`Please add ${requiredProjects} project(s) with files for the "${grade.split(':')[1].trim()}" grade.`);
      return;
    }

    setIsSubmitting(true);

    const submissionPromise = async () => {
      const allFilePromises = submittedProjects.flatMap(project =>
        project.files.map(file => {
          if (file instanceof File) return uploadFile(file).then(up => ({ projectName: project.projectName, fileUrl: up.url }));
          return Promise.resolve({ projectName: project.projectName, fileUrl: file as string });
        })
      );
      const previousJobPhotoUrls = await Promise.all(allFilePromises);
      await updateFundiExperience(axiosInstance, { skill: user.skills, grade, experience, previousJobPhotoUrls });
    };

    try {
      await toast.promise(
        submissionPromise(),
        {
          loading: 'Processing your submission...',
          success: 'Experience updated successfully!',
          error: (error) => error.response?.data?.message || 'Failed to update experience.',
        }
      );
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProfile) return <div className="flex items-center justify-center p-8"><p>Loading...</p></div>;

  const inputStyles = "w-full p-3 border rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="flex">
      <div className="bg-gray-50 min-h-screen w-full p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Fundi Experience</h1>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {isReadOnly && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm" role="alert">
                Your profile has been approved and is read-only. Contact support for changes.
              </div>
            )}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Fundi Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skill</label>
                  <input type="text" value={user.userProfile.skill || ''} readOnly className="w-full p-3 bg-gray-200 text-gray-700 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} required className={inputStyles} disabled={isReadOnly}>
                    <option value="" disabled>Select Grade</option>
                    {Object.keys(requiredProjectsByGrade).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <select value={experience} onChange={(e) => setExperience(e.target.value)} required className={inputStyles} disabled={isReadOnly}>
                    <option value="" disabled>Select Years</option>
                    {["5+ years", "3-5 years", "1-3 years"].map(exp => <option key={exp} value={exp}>{exp}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Project Upload Requirements</h2>
              <ul className="list-disc list-inside mt-2 text-sm text-blue-700 space-y-1">
                <li className={grade === 'G1: Master Fundi' ? 'font-bold text-blue-800' : ''}><strong>Master Fundi:</strong> Upload 3 projects.</li>
                <li className={grade === 'G2: Skilled' ? 'font-bold text-blue-800' : ''}><strong>Skilled Fundi:</strong> Upload 2 projects.</li>
                <li className={grade === 'G3: Semi-skilled' ? 'font-bold text-blue-800' : ''}><strong>Semi-skilled Fundi:</strong> Upload 1 project.</li>
                <li className={grade === 'G4: Unskilled' ? 'font-bold text-blue-800' : ''}><strong>Unskilled Fundi:</strong> No projects required.</li>
              </ul>
            </div>

            {evaluationResults && (
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-xl font-semibold mb-4 text-green-900">Evaluation Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">Materials Used:</p>
                    <p className="text-gray-800">{evaluationResults.materialsUsed || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Major Works Assessment:</p>
                    <p className="text-gray-800">{evaluationResults.hasMajorWorks || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Essential Equipment:</p>
                    <p className="text-gray-800">{evaluationResults.essentialEquipment || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Quotation Formulation:</p>
                    <p className="text-gray-800">{evaluationResults.quotationFormulation || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-green-300">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Scores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Major Works</p>
                      <p className="text-lg font-bold text-gray-800">{evaluationResults.majorWorksScore}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Materials</p>
                      <p className="text-lg font-bold text-gray-800">{evaluationResults.materialsUsedScore}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Equipment</p>
                      <p className="text-lg font-bold text-gray-800">{evaluationResults.essentialEquipmentScore}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quotation</p>
                      <p className="text-lg font-bold text-gray-800">{evaluationResults.quotationFormulaScore}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1 bg-green-200 p-2 rounded-lg">
                      <p className="text-xs font-semibold text-green-900">TOTAL</p>
                      <p className="text-2xl font-extrabold text-green-900">{evaluationResults.totalScore}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto border rounded-xl p-4 bg-gray-50">
              <legend className="text-xl font-semibold mb-4 px-2 text-gray-700">Previous Projects</legend>
              {visibleProjectRows > 0 ? (
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                      <th className="px-4 py-3 w-[10%]">No.</th>
                      <th className="px-4 py-3 w-[40%]">Project Name</th>
                      <th className="px-4 py-3 w-[50%]">Photos (Max 3)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {attachments.slice(0, visibleProjectRows).map((row) => (
                      <tr key={row.id} className="hover:bg-gray-100 align-top">
                        <td className="px-4 py-4 font-semibold text-gray-500">{row.id}</td>
                        <td className="px-4 py-4">
                          <input type="text" placeholder="Enter project name" value={row.projectName} onChange={(e) => handleProjectNameChange(row.id, e.target.value)} className="w-full p-2 border rounded-lg" disabled={isReadOnly} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            {row.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between gap-2 bg-gray-100 p-2 rounded-lg">
                                <span className="text-xs text-gray-700 truncate">{typeof file === 'string' ? new URL(file).pathname.split('/').pop() : file.name}</span>
                                <div className="flex items-center gap-2">
                                  {typeof file === 'string' && <a href={file} target="_blank" rel="noopener noreferrer"><EyeIcon className="w-5 h-5 text-blue-600" /></a>}
                                  {!isReadOnly && <button type="button" onClick={() => removeFile(row.id, index)}><XMarkIcon className="w-5 h-5 text-red-500" /></button>}
                                </div>
                              </div>
                            ))}
                            {!isReadOnly && row.files.length < 3 && (
                              <input type="file" accept="image/*" onChange={(e) => handleFileChange(row.id, e.target.files?.[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No project uploads are required for the selected grade.
                </div>
              )}
            </div>

            {!isReadOnly && (
              <div className="mt-6 pt-4 text-right border-t">
                <button type="submit" disabled={isSubmitting} className="bg-blue-800 text-white px-8 py-3 rounded-md hover:bg-blue-900 transition disabled:opacity-50 font-semibold">
                  {isSubmitting ? "Submitting..." : "Submit Experience"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FundiExperience;