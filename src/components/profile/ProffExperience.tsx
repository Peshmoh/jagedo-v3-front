/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck

import { useState, useMemo, useEffect } from "react";
import toast from 'react-hot-toast';
import { XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { updateProfessionalExperience } from "@/api/experience.api";
import { getProviderProfile } from "@/api/provider.api";
import { uploadFile } from "@/utils/fileUpload";
import { useGlobalContext } from "@/context/GlobalProvider"

type FileOrUrl = File | string;

interface AttachmentRow {
    id: number;
    projectName: string;
    files: FileOrUrl[];
}

interface ProjectPayload {
    projectName: string;
    fileUrl: string;
}
export interface ProfessionalExperiencePayload {
    professionalProjects: ProjectPayload[];
    level: string;
    yearsOfExperience: string;
}

const PROJECT_REQUIREMENTS = {
    senior: 5,
    professional: 3,
    graduate: 1,
    student: 0,
};

const ProffExperience = () => {
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
    const { logout, user: contextUser } = useGlobalContext();
    const user = contextUser || (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null);

    const [level, setLevel] = useState("");
    const [experience, setExperience] = useState("");
    const [attachments, setAttachments] = useState<AttachmentRow[]>([]);

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    const isReadOnly = user?.adminApproved === true;

    useEffect(() => {
        const fetchExperience = async () => {
            const initialAttachments = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, projectName: "", files: [] }));

            try {
                const response = await getProviderProfile(axiosInstance, user.id);

                if (response.success && response.data?.userProfile) {
                    const profile = response.data.userProfile;
                    setLevel(profile.professionalLevel || "");
                    setExperience(profile.yearsOfExperience || "");

                    if (profile.professionalProjects && profile.professionalProjects.length > 0) {
                        const groupedProjects = profile.professionalProjects.reduce((acc, item) => {
                            acc[item.projectName] = acc[item.projectName] || [];
                            acc[item.projectName].push(item.fileUrl);
                            return acc;
                        }, {});

                        const populatedAttachments = Object.entries(groupedProjects).map(([projectName, files], index) => ({
                            id: index + 1,
                            projectName: projectName,
                            files: files as string[],
                        }));

                        while (populatedAttachments.length < 5) {
                            populatedAttachments.push({ id: populatedAttachments.length + 1, projectName: "", files: [] });
                        }
                        setAttachments(populatedAttachments);
                    } else {
                        setAttachments(initialAttachments);
                    }
                } else {
                    setAttachments(initialAttachments);
                }
            } catch (error) {
                console.error("Failed to fetch professional experience:", error);
                toast.error("Could not load your existing experience data.");
                setAttachments(initialAttachments);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        if (user?.id) {
            fetchExperience();
        } else {
            setIsLoadingProfile(false);
        }
    }, [user?.id]);

    const rowsToShow = useMemo(() => {
        const levelKey = level.toLowerCase().trim() as keyof typeof PROJECT_REQUIREMENTS;
        return PROJECT_REQUIREMENTS[levelKey] ?? 0;
    }, [level]);

    const updateExperienceOnServer = async (
        currentLevel: string,
        currentExperience: string,
        currentAttachments: AttachmentRow[]
    ) => {
        const providedProjects = currentAttachments.slice(0, rowsToShow).filter(p => p.projectName.trim() !== "" && p.files.length > 0);

        const projectPayloadPromises = providedProjects.flatMap(project =>
            project.files.map(file => {
                if (file instanceof File) {
                    return uploadFile(file).then(uploaded => ({
                        projectName: project.projectName.trim(),
                        fileUrl: uploaded.url,
                    }));
                }
                return Promise.resolve({
                    projectName: project.projectName.trim(),
                    fileUrl: file as string,
                });
            })
        );

        const professionalProjects = await Promise.all(projectPayloadPromises);
        const payload: ProfessionalExperiencePayload = {
            level: currentLevel,
            yearsOfExperience: currentExperience,
            professionalProjects: professionalProjects,
        };

        await updateProfessionalExperience(axiosInstance, payload);
    };

    const handleFileChange = (rowId: number, file: File | null) => {
        if (!file) return;
        setAttachments((prev) =>
            prev.map((item) => item.id === rowId && item.files.length < 3 ? { ...item, files: [...item.files, file] } : item)
        );
    };
    const handleProjectNameChange = (rowId: number, value: string) => {
        setAttachments((prev) => prev.map((item) => item.id === rowId ? { ...item, projectName: value } : item));
    };

    const removeFile = async (rowId: number, fileIndex: number) => {
        const updatedAttachments = attachments.map((item) => {
            if (item.id === rowId) {
                const newFiles = [...item.files];
                newFiles.splice(fileIndex, 1);
                return { ...item, files: newFiles };
            }
            return item;
        });

        try {
            await toast.promise(
                updateExperienceOnServer(level, experience, updatedAttachments),
                {
                    loading: 'Deleting file...',
                    success: 'File deleted successfully!',
                    error: (err: any) => err.response?.data?.message || 'Failed to delete file.',
                }
            );
            setAttachments(updatedAttachments);
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isReadOnly) {
            toast.error("Your approved profile cannot be modified.");
            return;
        }
        if (!level || !experience) {
            return toast.error("Please select a Level and your Years of Experience.");
        }
        const providedProjects = attachments.slice(0, rowsToShow).filter(p => p.projectName.trim() !== "" && p.files.length > 0);
        if (providedProjects.length < rowsToShow) {
            return toast.error(`Please provide all ${rowsToShow} required projects for the '${level}' level.`);
        }

        setIsSubmitting(true);

        try {
            await toast.promise(
                updateExperienceOnServer(level, experience, attachments),
                {
                    loading: 'Processing your submission...',
                    success: 'Experience updated successfully!',
                    error: (err: any) => err.response?.data?.message || err.message || "An unknown error occurred.",
                }
            );
            setSubmitted(true);
            // Logout User after successful update
            logout();
        } catch (err) {
            console.error("Submission failed:", err);
            // Error is handled by toast.promise
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingProfile) {
        return <div className="p-8 text-center text-gray-600">Loading professional profile...</div>;
    }

    const inputStyles = "w-full p-3 border rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed";

    return (
        <div className="flex">
            <div className="p-2 sm:p-4 md:p-8 bg-gray-50 min-h-screen w-full">
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">Professional Experience</h1>
                    {!submitted ? (
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {isReadOnly && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm" role="alert">
                                    Your profile has been approved and is now read-only. To request changes, please contact support.
                                </div>
                            )}

                            <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                                <h2 className="text-xl font-semibold mb-6 text-gray-800">Professional Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <input type="text" value={user?.profession} readOnly className="w-full p-3 bg-gray-200 text-gray-700 border rounded-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Level</label>
                                        <select value={level} onChange={(e) => setLevel(e.target.value)} required className={inputStyles} disabled={isReadOnly}>
                                            <option value="" disabled>Select Level</option>
                                            {[
                                                "Graduate",
                                                "Student",
                                                "Senior",
                                                "Professional",
                                            ].map(option =>
                                                <option key={option} value={option}>{option}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Experience</label>
                                        <select value={experience} onChange={(e) => setExperience(e.target.value)} required className={inputStyles} disabled={isReadOnly}>
                                            <option value="" disabled>Select Years</option>
                                            {["5+ years", "3-5 years", "1-3 years"].map(option =>
                                                <option key={option} value={option}>{option}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {rowsToShow > 0 && (
                                <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                                    <h2 className="text-xl font-semibold mb-6 text-gray-800 md:hidden">Projects</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="hidden md:table-header-group">
                                                <tr className="bg-gray-100">
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-1/12">No.</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-4/12">Project Name</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-7/12">Project Files (Max 3)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 md:divide-y">
                                                {attachments.slice(0, rowsToShow).map((row) => (
                                                    <tr key={row.id} className="block md:table-row mb-6 md:mb-0 p-4 md:p-0 rounded-lg md:rounded-none bg-white md:bg-transparent shadow-md md:shadow-none relative md:hover:bg-gray-50">
                                                        <td className="absolute top-3 left-3 h-8 w-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full font-bold md:relative md:top-auto md:left-auto md:h-auto md:w-auto md:bg-transparent md:font-normal md:px-6 md:py-4 md:text-gray-500">
                                                            <span className="md:hidden">{row.id}</span>
                                                            <span className="hidden md:inline">{row.id}</span>
                                                        </td>
                                                        <td className="block md:table-cell pt-12 md:pt-0 md:px-6 md:py-4">
                                                            <span className="font-semibold text-gray-600 md:hidden">Project Name</span>
                                                            <input type="text" placeholder="Enter project name" value={row.projectName} onChange={(e) => handleProjectNameChange(row.id, e.target.value)} className="w-full p-2 border rounded-lg mt-1 md:mt-0 disabled:bg-gray-100 disabled:cursor-not-allowed" disabled={isSubmitting || isReadOnly} />
                                                        </td>
                                                        <td className="block md:table-cell pt-4 md:pt-0 md:px-6 md:py-4">
                                                            <span className="font-semibold text-gray-600 md:hidden">Project Files (Max 3)</span>
                                                            <div className="space-y-2 mt-1 md:mt-0">
                                                                {row.files.map((file, index) => {
                                                                    const isUrl = typeof file === 'string';
                                                                    const fileName = isUrl ? new URL(file).pathname.split('/').pop() : file.name;
                                                                    return (
                                                                        <div key={index} className="flex items-center justify-between gap-2 bg-gray-100 p-2 rounded-lg">
                                                                            <span className="text-sm text-gray-700 truncate" title={fileName}>{fileName}</span>
                                                                            <div className="flex items-center gap-2">
                                                                                {isUrl && <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600"><EyeIcon className="w-5 h-5" /></a>}
                                                                                {!isReadOnly && <button type="button" onClick={() => removeFile(row.id, index)} className="text-red-500 hover:text-red-700" disabled={isSubmitting}><XMarkIcon className="w-5 h-5" /></button>}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                                {!isReadOnly && row.files.length < 3 && (
                                                                    <input type="file" onChange={(e) => handleFileChange(row.id, e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" disabled={isSubmitting} />
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {!isReadOnly && (
                                <div className="mt-6 text-center md:text-right">
                                    <button type="submit" className="w-full md:w-auto bg-blue-800 text-white px-8 py-3 rounded-md hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit Experience"}
                                    </button>
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="space-y-8 text-center p-4">
                            <div className="bg-green-50 border p-6 rounded-lg">
                                <h2 className="text-xl md:text-2xl font-bold text-green-800">Submission Successful!</h2>
                                <p className="text-green-700 mt-2">Your professional experience has been updated. You will be logged out.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProffExperience;