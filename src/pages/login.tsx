/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import { loginUser, verifyOtpLogin, phoneLogin } from "@/api/auth.api";
import GoogleSignIn from "@/components/GoogleSignIn"
import { jwtDecode } from "jwt-decode";

// Mock components for demonstration
const Button = ({
    children,
    className = "",
    disabled = false,
    type = "button",
    variant = "default",
    onClick,
    ...props
}) => {
    const baseClasses =
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        default:
            "bg-[#00007a] text-white hover:bg-[#00007a]/90 hover:shadow-lg hover:shadow-[#00007a]/25 focus:ring-[#00007a]/50",
        outline:
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500/50"
    };
    const disabledClasses = disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer";
    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${disabledClasses} ${className}`}
            disabled={disabled}
            type={type as "button" | "submit" | "reset" | undefined}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

const Input = ({ className = "", ...props }) => (
    <input
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00007a]/50 focus:border-[#00007a] transition-all duration-200 ${className}`}
        {...props}
    />
);

export default function Login() {
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isOtpFlow, setIsOtpFlow] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email or phone number is required";
        }

        if (isOtpFlow) {
            const isPhone = /^[\+]?[0-9\s\-()]+$/.test(formData.email);
            if (!isPhone) {
                newErrors.email = "Please enter a valid phone number for OTP login";
            }
            if (otpSent && !otp) {
                newErrors.otp = "OTP is required";
            }
        } else {
            if (!formData.password) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- CHANGE 1: ADDED PHONE NUMBER NORMALIZATION FUNCTION ---
    const normalizePhoneNumber = (phone) => {
        const trimmedPhone = phone.trim();
        if (trimmedPhone.startsWith('07') || trimmedPhone.startsWith('01')) {
            return trimmedPhone.substring(1);
        }
        return trimmedPhone;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            let response;
            const isPhone = /^[\+]?[0-9\s\-()]+$/.test(formData.email);

            if (isOtpFlow) {
                // --- OTP flow logic starts here ---
                const normalizedPhone = normalizePhoneNumber(formData.email); // Use the normalized number

                if (!otpSent) {
                    // Send OTP request
                    response = await phoneLogin({
                        phoneNumber: normalizedPhone // Send normalized number
                    });

                    if (response?.success) {
                        setOtpSent(true);
                        toast.success("OTP sent successfully!");
                    } else {
                        toast.error(`Failed to send OTP: ${response?.message || "Unknown error"}`);
                    }
                } else {
                    // Verify OTP
                    response = await verifyOtpLogin({
                        phoneNumber: normalizedPhone, // Send normalized number
                        otp: otp
                    });

                    if (response?.success) {
                        localStorage.setItem("user", JSON.stringify(response.user));
                        localStorage.setItem("token", response.accessToken);
                        const rocketAuthToken = jwtDecode(response.accessToken).rocketAuthToken;
                        console.log("Decoded Rocket Auth Token:", rocketAuthToken);
                        localStorage.setItem("rocketAuthToken", rocketAuthToken);
                        setUser(response.user);
                        setIsLoggedIn(true);
                        toast.success("Login successful! Redirecting to dashboard...");
                        redirectUser(response.user.userType);
                    } else {
                        toast.error(`Failed to verify OTP: ${response?.message || "Invalid OTP"}`);
                    }
                }
            } else {
                // --- CHANGE 2: STANDARD PASSWORD LOGIN NOW REJECTS PHONE NUMBERS ---
                if (isPhone) {
                    toast.error("To log in with a phone number, please use the 'Login with OTP' option.");
                    setIsLoading(false); // Stop loading before returning
                    return; // Stop the function here
                }

                // If not a phone number, proceed with email/username login
                response = await loginUser({
                    username: formData.email,
                    password: formData.password,
                    firebaseToken: ""
                });

                if (response?.success) {
                    localStorage.setItem("user", JSON.stringify(response.user));
                    localStorage.setItem("token", response.accessToken);
                    setUser(response.user);
                    setIsLoggedIn(true);
                    toast.success("Login successful! Redirecting to dashboard...");
                    redirectUser(response.user.userType);
                } else {
                    toast.error(`Failed to login: ${response?.message || "Invalid credentials"}`);
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(`Failed to login: ${error?.response?.data?.message || "Invalid credentials"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const redirectUser = (userType) => {
        setTimeout(() => {
            switch (userType?.toLowerCase()) {
                case "customer": navigate("/dashboard/customer"); break;
                case "fundi": navigate("/dashboard/fundi"); break;
                case "professional": navigate("/dashboard/professional"); break;
                case "contractor": navigate("/dashboard/contractor"); break;
                case "hardware": navigate("/dashboard/hardware"); break;
                case "admin": navigate("/dashboard/admin"); break;
                default: navigate("/");
            }
        }, 1500);
    };

    const handleGoogleSignIn = () => { /* Your Google Sign-In Logic */
        setIsGoogleLoading(false)
    };

    const toggleOtpFlow = () => {
        setIsOtpFlow(!isOtpFlow);
        setOtpSent(false);
        setOtp("");
        setErrors({});
        setFormData({ email: "", password: "" });
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            const isPhone = /^[\+]?[0-9\s\-()]+$/.test(formData.email);
            if (isPhone) {
                // --- CHANGE 1: Use normalized number for resend ---
                const normalizedPhone = normalizePhoneNumber(formData.email);
                const response = await phoneLogin({
                    phoneNumber: normalizedPhone
                });

                if (response?.success) {
                    toast.success("OTP resent successfully!");
                } else {
                    toast.error(`Failed to resend OTP: ${response?.message || "Unknown error"}`);
                }
            } else {
                toast.error("Invalid phone number format");
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error("Failed to resend OTP");
        } finally {
            setIsLoading(false);
        }
    };

    // The entire JSX return block is unchanged from your last "correct" version.
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Toaster position="top-center" richColors />
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 flex flex-col items-center">
                <img src="/jagedologo.png" alt="JaGedo Logo" className="h-12 mb-6" />
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">User Login</h1>
                <p className="text-gray-600 mb-6 text-center">
                    {isOtpFlow ? "Enter your phone number to receive OTP" : "What is your phone number or email?"}
                </p>
                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <Input
                            id="email"
                            name="email"
                            type="text"
                            placeholder={isOtpFlow ? "Enter phone number" : "Enter phone number or email"}
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={isOtpFlow && otpSent}
                        />
                        {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
                    </div>
                    {isOtpFlow && otpSent && (
                        <div>
                            <Input
                                id="otp"
                                name="otp"
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                className="w-full h-12 px-4 border border-gray-300 rounded-lg"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                            />
                            {errors.otp && (<p className="text-red-500 text-sm mt-1">{errors.otp}</p>)}
                            <div className="mt-2">
                                <button type="button" className="text-blue-500 hover:text-blue-700 text-sm font-medium" onClick={handleResendOtp} disabled={isLoading}>
                                    Resend OTP
                                </button>
                            </div>
                        </div>
                    )}
                    {!isOtpFlow && (
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password..."
                                className="w-full h-12 px-4 border border-gray-300 rounded-lg pr-10"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (<EyeOff className="h-5 w-5" />) : (<Eye className="h-5 w-5" />)}
                            </button>
                            {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password}</p>)}
                        </div>
                    )}
                    <div className="text-center">
                        <button type="button" className="text-blue-500 hover:text-blue-700 text-sm font-medium" onClick={toggleOtpFlow}>
                            {isOtpFlow ? "Login with password instead" : "Login with OTP instead"}
                        </button>
                    </div>
                    <Button type="submit" className="w-full h-12 bg-[#00007a] hover:bg-[#00007a]/90 text-white font-medium rounded-lg" disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                {isOtpFlow ? (otpSent ? "Verifying..." : "Sending OTP...") : "Login..."}
                            </div>
                        ) : (isOtpFlow ? (otpSent ? "Verify OTP" : "Send OTP") : "Login")}
                    </Button>
                    {!isOtpFlow && (
                        <div className="text-center">
                            <a href="/forgot-password" className="text-blue-500 hover:text-blue-700 text-sm font-medium">Forgot password?</a>
                        </div>
                    )}
                    {/* GOOGLE LOGIN */}
                    <div className="flex justify-center items-center h-full mt-6">
                        {!isOtpFlow && <GoogleSignIn />}
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-700">Don't have an account?{" "}<a href="/" className="text-blue-500 hover:text-blue-700 font-medium">Sign Up</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}