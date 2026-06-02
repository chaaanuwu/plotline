import { useState, useEffect } from "react";
import bg from "../assets/plotline-cover.png";
import { toast } from "sonner";
import useUserStore from "../store/userStore";
import { signIn, signUp } from "../api/auth.api";

export default function SignUpPage() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");

    // Access store values safely through standard reactive selectors
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const heroImage = sessionStorage.getItem("landingHeroImage") ? JSON.parse(sessionStorage.getItem("landingHeroImage")) : null;

    // Auto-routing guard clause: If user session is active, push them out
    useEffect(() => {
        if (user) {
            window.location.href = "/"; // Adjust matching your route layout
        }
    }, [user]);

    // Form states
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        gender: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setError("");

        if (step === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email) {
                setError("Please fill in all fields.");
                return;
            }
            if (formData.firstName.length < 2 || formData.lastName.length < 2) {
                setError("Names must be at least 2 characters long.");
                return;
            }
            if (!/.+@.+\..+/.test(formData.email)) {
                setError("Please enter a valid email address.");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.dob || !formData.gender) {
                setError("Please fill in all fields.");
                return;
            }
            setStep(3);
        }
    };

    const handleBackStep = () => {
        setError("");
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const formattedEmail = formData.email.toLowerCase();

            // 1. Submit Registration Payload
            const signupRes = await signUp(
                formData.firstName,
                formData.lastName,
                formattedEmail,
                formData.password,
                formData.dob,
                formData.gender
            );

            // Support both direct root success properties or nested data blocks safely
            const isSignupSuccess = signupRes?.success || signupRes?.data?.success || signupRes?.status === "success";

            if (isSignupSuccess) {
                // 2. Automatically trigger session login pipeline
                const loginRes = await signIn(formattedEmail, formData.password);
                
                // Unpack variables with robust safety structures
                const targetToken = loginRes?.token || loginRes?.data?.token;
                const targetUser = loginRes?.user || loginRes?.data?.user;

                if (targetToken && targetUser) {
                    localStorage.setItem("token", targetToken);
                    
                    // FIXED: Setting user safely using React lifecycle actions
                    setUser(targetUser); 
                    toast.success("Welcome to PlotLine! Account created successfully.");
                } else {
                    throw new Error("Account created but automatic authentication failed. Please sign in manually.");
                }
            } else {
                throw new Error(signupRes?.message || "Server rejected registration data details.");
            }

        } catch (err) {
            console.error("Registration workflow failure:", err);
            const dynamicErrorMessage = err.response?.data?.message || err.message || "Registration failed";
            setError(dynamicErrorMessage);
            toast.error(dynamicErrorMessage);
        }
    };

    return (
        <main className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden antialiased selection:bg-amber-500/30 px-4 sm:px-6 lg:px-8">

            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 w-full z-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
                    <div className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase cursor-pointer select-none" onClick={() => window.location.href = "/"}>
                        Plot<span className="text-amber-500 font-bold">Line</span>
                    </div>
                </div>
            </nav>

            {/* Background Image Layer */}
            <div
                className="absolute inset-0 z-0 pointer-events-none transform scale-102"
                style={{
                    backgroundImage: `url(${heroImage ? `${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${heroImage}` : bg})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            />

            {/* Premium Multi-stop Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/75 to-black/95 z-0" />

            {/* Expanded Premium Content Card */}
            <div className="relative z-10 w-full max-w-120 backdrop-blur-2xl bg-black/50 border border-white/8 rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.9)] p-8 sm:p-10 text-white transition-all duration-300">

                {/* Progress Visual Tracker Header */}
                <div className="flex items-center justify-between mb-8 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    <span>Create Account</span>
                    <span className="text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        Step {step} of 3
                    </span>
                </div>

                {/* Error Alert Display */}
                {error && (
                    <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-medium tracking-wide transition-all">
                        {error}
                    </div>
                )}

                {/* Conditionally Render Form Subsections based on local step state */}
                <form onSubmit={step === 3 ? handleFinalSubmit : handleNextStep} className="space-y-4">
                    
                    {/* STEP 1: ACCOUNT BASICS */}
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold tracking-wider uppercase text-gray-400/90">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Jane"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 placeholder-gray-600"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold tracking-wider uppercase text-gray-400/90">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 placeholder-gray-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold tracking-wider uppercase text-gray-400/90">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 placeholder-gray-600"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PROFILE META DATA */}
                    {step === 2 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold tracking-wider uppercase text-gray-400/90">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 scheme-dark"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold tracking-wider uppercase text-gray-400/90">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/8 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                                    required
                                >
                                    <option value="" disabled hidden>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: ACCOUNT PASSWORDS SECURITY */}
                    {step === 3 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold tracking-wider uppercase text-gray-400/90">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 placeholder-gray-600"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold tracking-wider uppercase text-gray-400/90">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 placeholder-gray-600"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Control Footers */}
                    <div className="flex gap-3 pt-4">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBackStep}
                                className="w-1/3 py-3 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 active:scale-[0.98] transition-all duration-200"
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            className={`py-3 rounded-xl bg-white text-black font-semibold text-sm tracking-wide shadow-xl hover:bg-gray-100 active:scale-[0.99] transition-all duration-200 ${
                                step === 1 ? "w-full" : "grow"
                            }`}
                        >
                            {step === 3 ? "Complete Registration" : "Continue"}
                        </button>
                    </div>

                    {/* Back to Login redirection */}
                    {step === 1 && (
                        <p className="text-center text-xs text-gray-400 pt-2 font-light tracking-wide">
                            Already have an account?{" "}
                            <span className="text-amber-500 font-medium underline underline-offset-4 cursor-pointer hover:text-amber-400 transition-colors" onClick={() => window.location.href = "/login"}>
                                Log in
                            </span>
                        </p>
                    )}

                </form>
            </div>
        </main>
    );
}