/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-hot-toast";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
    getProviderProfile,
    updateProfilePhoneNumber,
    updateProfileEmail,
    updateProfileImage,
    requestEmailUpdateOtp,
    requestPhoneUpdateOtp,
} from "@/api/provider.api";
import { uploadFile } from "@/utils/fileUpload";

function EditPhone({ currentPhone, onRequestOtp, onVerify, onCancel }) {
    const [phoneValue, setPhoneValue] = useState(() => {
        const phone = currentPhone?.toString() || '';
        if (phone.startsWith('254')) return phone.replace(/\D/g, '');
        if (phone) return `254${phone.slice(-9).replace(/\D/g, '')}`;
        return '254';
    });
    const [otpValue, setOtpValue] = useState("");
    const [step, setStep] = useState("enterPhone");
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value;
        if (!inputValue.startsWith('254') || inputValue.length < 3) {
            setPhoneValue('254');
            return;
        }
        const suffix = inputValue.substring(3).replace(/\D/g, '');
        setPhoneValue(`254${suffix}`);
    };

    const handleRequestOtp = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Sending OTP...");
        try {
            const result = await onRequestOtp(phoneValue);
            if (result.success) {
                toast.success("OTP sent successfully!", { id: toastId });
                setStep("enterOtp");
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(result?.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Verifying OTP...");
        try {
            const result = await onVerify(phoneValue, otpValue);
            if (result.success) {
                toast.success("Phone number updated successfully!", { id: toastId });
                setTimeout(() => {
                    onCancel();
                }, 1500);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(result.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 mx-4 shadow-xl">
                {step === 'enterPhone' ? (
                    <>
                        <h1 className="text-2xl font-semibold text-gray-900">Update Phone Number</h1>
                        <p className="mt-2 text-sm text-gray-600">A verification code will be sent to this number.</p>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">New Phone Number</label>
                            <input type="tel" value={phoneValue} onChange={handlePhoneChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={handleRequestOtp} disabled={isLoading} className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50">
                                {isLoading ? "Sending OTP..." : "Send OTP"}
                            </button>
                            <button type="button" onClick={onCancel} className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300">Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold text-gray-900">Enter Verification Code</h1>
                        <p className="mt-2 text-sm text-gray-600">We've sent a code to {phoneValue}.</p>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Verification Code (OTP)</label>
                            <input type="text" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={handleVerify} disabled={isLoading} className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50">
                                {isLoading ? "Verifying..." : "Verify & Update"}
                            </button>
                            <button type="button" onClick={() => setStep('enterPhone')} className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300">Back</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function EditEmail({ currentEmail, onRequestOtp, onVerify, onCancel }) {
    const [emailValue, setEmailValue] = useState(currentEmail);
    const [otpValue, setOtpValue] = useState("");
    const [step, setStep] = useState("enterEmail");
    const [isLoading, setIsLoading] = useState(false);
    const { logout } = useGlobalContext();

    const handleRequestOtp = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Sending OTP...");
        try {
            const result = await onRequestOtp(emailValue);
            if (result.success) {
                toast.success(result.message);
                setStep("enterOtp");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(result.message, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Verifying OTP...");
        try {
            const result = await onVerify(emailValue, otpValue);
            if (result) {
                toast.success("Email updated successfully! Logging out...", { id: toastId, duration: 2500 });
                setTimeout(() => {
                    onCancel();
                    logout();
                }, 2500);
            } else {
                toast.error(result.message, { id: toastId });
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(result.message, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 mx-4 shadow-xl">
                {step === 'enterEmail' ? (
                    <>
                        <h1 className="text-2xl font-semibold text-gray-900">Update Email</h1>
                        <p className="mt-2 text-sm text-gray-600">A verification code will be sent to this email.</p>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">New Email Address</label>
                            <input type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={handleRequestOtp} disabled={isLoading} className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50">
                                {isLoading ? "Sending OTP..." : "Send OTP"}
                            </button>
                            <button type="button" onClick={onCancel} className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300">Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold text-gray-900">Enter Verification Code</h1>
                        <p className="mt-2 text-sm text-gray-600">We've sent a code to {emailValue}.</p>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Verification Code (OTP)</label>
                            <input type="text" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={handleVerify} disabled={isLoading} className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50">
                                {isLoading ? "Verifying..." : "Verify & Update"}
                            </button>
                            <button type="button" onClick={() => setStep('enterEmail')} className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300">Back</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const AccountInfo = () => {
    const fileInputRef = useRef(null);
    const [imageSrc, setImageSrc] = useState("/profile.jpg");
    const { user } = useGlobalContext();
    const isReadOnly = user?.adminApproved === true && ["PROFESSIONAL", "CONTRACTOR", "FUNDI", "HARDWARE"].includes(user?.userType);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [phoneValue, setPhoneValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [providerProfile, setProviderProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const toastId = toast.loading("Uploading image...");
            try {
                const uploaded = await uploadFile(file);
                await updateProfileImage(axiosInstance, uploaded.url);
                setImageSrc(uploaded.url);
                fetchProviderProfile();
                toast.success("Profile image updated!", { id: toastId });
            } catch (err) {
                console.error("Failed to update profile image:", err);
                toast.error("Failed to update profile image.", { id: toastId });
            }
        }
    };

    const handlePhoneRequestOtp = async (newPhone) => {
        try {
            const response = await requestPhoneUpdateOtp(axiosInstance, { phone: newPhone });
            return response;
        } catch (error) {
            console.error("Failed to request phone OTP:", error);
            return false;
        }
    };

    const handlePhoneVerify = async (newPhone, otp) => {
        try {
            const payload = { phone: newPhone, otp: otp };
            const result = await updateProfilePhoneNumber(axiosInstance, payload);
            if (result.success) {
                setPhoneValue(newPhone);
                setIsEditingPhone(false);
                fetchProviderProfile();
            }
            return result;
        } catch (error) {
            console.error("Failed to verify phone:", error);
            throw error;
        }
    };

    const handleEmailRequestOtp = async (newEmail) => {
        try {
            const response = await requestEmailUpdateOtp(axiosInstance, { email: newEmail });
            return response;
        } catch (error) {
            console.error("Failed to request email OTP:", error);
            return false;
        }
    };

    const handleEmailVerify = async (newEmail, otp) => {
        try {
            const payload = { email: newEmail, otp: otp };
            const result = await updateProfileEmail(axiosInstance, payload);
            if (result.success) {
                setEmailValue(newEmail);
                setIsEditingEmail(false);
                fetchProviderProfile();
            }
            return result;
        } catch (error) {
            console.error("Failed to verify email:", error);
            throw error;
        }
    };

    const fetchProviderProfile = async () => {
        if (user?.id) {
            try {
                setLoading(true);
                const profile = await getProviderProfile(axiosInstance, user.id);
                setProviderProfile(profile.data);
                setPhoneValue(profile.data.phoneNumber || "");
                setEmailValue(profile.data.email || "");
            } catch (error) {
                console.error("Failed to fetch provider profile:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchProviderProfile();
    }, [user?.id]);

    const Avatar = ({ src, alt, size }) => {
        const sizeClass = size === "l" ? "w-24 h-24" : "w-12 h-12";
        return <img src={src} alt={alt} className={`${sizeClass} rounded-full object-cover border-2 border-gray-200`} />;
    };

    if (loading) {
        return (
            <section className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6">Account Info</h1>

                {isReadOnly && (
                    <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-200">
                        Your profile has been approved. To update your account information, please contact support.
                    </div>
                )}

                <div className="flex flex-col items-start mb-8">
                    <Avatar size="l" alt="avatar" src={providerProfile?.userProfile?.profileImage || imageSrc} />
                    {!isReadOnly && (
                        <>
                            <button type="button" onClick={handleButtonClick} className="mt-4 text-[rgb(0,0,122)] hover:text-[rgb(0,0,150)] text-sm font-medium">Change Photo</button>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                        </>
                    )}
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold pb-2">Basic Info</h2>
                    <div className="space-y-4">
                        {providerProfile?.userType === "HARDWARE" && (
                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                <div className="space-y-2 relative"><label className="block text-sm font-medium">Hardware Name</label><div className="flex items-center"><input type="text" value={providerProfile.organizationName || ""} readOnly className="w-full px-4 py-2 outline-none bg-transparent" /></div></div>
                                <h3 className="text-lg font-semibold pt-4 border-t">Contact Person</h3>
                                <div className="space-y-2 relative"><label className="block text-sm font-medium">Full Name</label><div className="flex items-center border-b"><input type="text" value={`${providerProfile.contactFirstName || ''} ${providerProfile.contactLastName || ''}`} readOnly className="w-full px-4 py-2 outline-none bg-transparent" /></div></div>
                                <div className="space-y-2 relative"><label className="block text-sm font-medium">Contact Phone</label><div className="flex items-center border-b"><input type="text" value={providerProfile.contactPhone || ""} readOnly className="w-full px-4 py-2 outline-none bg-transparent" /></div></div>
                                <div className="space-y-2 relative"><label className="block text-sm font-medium">Contact Email</label><div className="flex items-center border-b"><input type="text" value={providerProfile.contactEmail || ""} readOnly className="w-full px-4 py-2 outline-none bg-transparent" /></div></div>
                            </div>
                        )}

                        {providerProfile?.accountType === "ORGANIZATION" && providerProfile?.userType !== "HARDWARE" && (
                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                <div className="space-y-2 relative"><label className="block text-sm font-medium">Organization Name</label><div className="flex items-center"><input type="text" value={providerProfile.organizationName || ""} readOnly className="w-full px-4 py-2 outline-none bg-transparent" /></div></div>
                                <h3 className="text-lg font-semibold pt-4 border-t">Contact Person</h3>
                                <div className="space-y-2 relative"><label className="block text-sm font-medium">Full Name</label><div className="flex items-center border-b"><input type="text" value={`${providerProfile.contactFirstName || ''} ${providerProfile.contactLastName || ''}`} readOnly className="w-full px-4 py-2 outline-none bg-transparent" /></div></div>
                                <div className="space-y-2 relative"><label className="block text-sm font-medium">Contact Phone</label><div className="flex items-center border-b"><input type="text" value={providerProfile.contactPhone || ""} readOnly className="w-full px-4 py-2 outline-none bg-transparent" /></div></div>
                                <div className="space-y-2 relative"><label className="block text-sm font-medium">Contact Email</label><div className="flex items-center border-b"><input type="text" value={providerProfile.contactEmail || ""} readOnly className="w-full px-4 py-2 outline-none bg-transparent" /></div></div>
                            </div>
                        )}

                        {providerProfile?.userType !== "HARDWARE" && (<div className="space-y-4">
                            <div className="space-y-2 relative"><label className="block text-sm font-medium">Name</label><div className="flex items-center border-b focus-within:border-b-[rgb(0,0,122)] transition-all"><input type="tel" value={`${user?.firstName} ${user?.lastName}`} readOnly className="w-full px-4 py-2 outline-none bg-transparent" /></div></div>
                            <div className="space-y-2 relative"><label className="block text-sm font-medium">Account Phone Number</label><div className="flex items-center border-b focus-within:border-b-[rgb(0,0,122)] transition-all"><input type="tel" value={phoneValue} readOnly className="w-full px-4 py-2 outline-none bg-transparent" />{!isReadOnly && (<button type="button" onClick={() => setIsEditingPhone(true)} className="text-[rgb(0,0,122)] hover:opacity-75"><FiEdit size={15} /></button>)}</div></div>
                            <div className="space-y-2 relative"><label className="block text-sm font-medium">Account Email</label><div className="flex items-center border-b focus-within:border-b-[rgb(0,0,122)] transition-all"><input type="email" value={emailValue} readOnly className="w-full px-4 py-2 outline-none bg-transparent" />{!isReadOnly && (<button type="button" onClick={() => setIsEditingEmail(true)} className="text-[rgb(0,0,122)] hover:opacity-75"><FiEdit size={15} /></button>)}</div></div>
                        </div>)}
                    </div>
                </div>
            </section>

            {isEditingPhone && (
                <EditPhone currentPhone={phoneValue} onRequestOtp={handlePhoneRequestOtp} onVerify={handlePhoneVerify} onCancel={() => setIsEditingPhone(false)} />
            )}

            {isEditingEmail && (
                <EditEmail currentEmail={emailValue} onRequestOtp={handleEmailRequestOtp} onVerify={handleEmailVerify} onCancel={() => setIsEditingEmail(false)} />
            )}
        </>
    );
};

export default AccountInfo;