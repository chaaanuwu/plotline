import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/plotline-cover.png";
import Footer from "../components/Footer";
import useUserStore from "../store/userStore";
import { signIn } from "../api/auth.api";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { setUser } = useUserStore();
    const navigate = useNavigate();

    const heroImage = sessionStorage.getItem("landingHeroImage") ? JSON.parse(sessionStorage.getItem("landingHeroImage")) : null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await signIn(email, password);

            const targetToken = response?.token || response?.data?.token;
            const targetUser = response?.user || response?.data?.user || response?.data?.data?.user;

            if (targetToken && targetUser) {
                localStorage.setItem("token", targetToken);

                // Hydrate global Zustand state with full reactivity
                setUser(targetUser);

                toast.success("Login successful!");

                navigate("/");
            } else {
                throw new Error("Invalid response structural format from authentication API");
                toast.error("Unexpected response from server. Please try again later.");
            }

        } catch (error) {
            console.error("Login client lifecycle error:", error);
            setError(error.response?.data?.message || error.message || "Login failed");
            if (error.response?.status === 401) {
                toast.error("Invalid email or password");
            }
        }
    };

    return (
        <main className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden antialiased selection:bg-amber-500/30 px-4 sm:px-6 lg:px-8">

            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 w-full z-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
                    <div 
                        className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase cursor-pointer select-none transition-opacity hover:opacity-90" 
                        onClick={() => navigate("/")}
                    >
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
            <div className="relative z-10 w-full max-w-120 backdrop-blur-2xl bg-black/50 border border-white/8 rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.9)] p-8 sm:p-12 text-white transition-all duration-300">

                {/* Card Heading */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-semibold tracking-tight text-white mb-3">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
                        Track films. Save favorites. Tell your friends what’s good.
                    </p>
                </div>

                {/* Error Alert Display */}
                {error && (
                    <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-medium tracking-wide">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold tracking-wider uppercase text-gray-400/90">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-sm tracking-wide transition-all duration-200 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 placeholder-gray-600"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold tracking-wider uppercase text-gray-400/90">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-sm tracking-wide transition-all duration-200 focus:outline-none focus:border-amber-500/50 focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 placeholder-gray-600"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 rounded-xl bg-white text-black font-semibold text-sm tracking-wide shadow-xl hover:bg-gray-100 active:scale-[0.99] transition-all duration-200"
                    >
                        Sign In
                    </button>

                    <p className="text-center text-xs text-gray-400 pt-3 font-light tracking-wide">
                        Don’t have an account?{" "}
                        <span 
                            className="text-amber-500 font-medium underline underline-offset-4 cursor-pointer hover:text-amber-400 transition-colors"
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </span>
                    </p>

                </form>
            </div>
        </main>
    );
}