import { useState } from "react";

import bg from "../assets/bb-bg.jpg";
import Footer from "../components/Footer";
import useUserStore from "../store/userStore";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${import.meta.env.VITE_PLOTLINE_BASE_URL}/auth/sign-in`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.data.token);

            const user = useUserStore((state) => state.user);
            // setUser(data.data.user);
            useUserStore.setState({ user: data.data.user });

        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        }
    }

    return (
        <>
            <main className="relative min-h-screen w-full">

                {/* Background */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `url(${bg})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/80" />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen px-6">

                    <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

                        {/* Heading */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-3">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-gray-300">
                                Track films. Save favorites. Tell your friends what’s good.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label className="block text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-gray-300"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm mb-2">Password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-gray-300"
                                />
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
                            >
                                Login
                            </button>

                            {/* Extra */}
                            <p className="text-center text-sm text-gray-300">
                                Don’t have an account?{" "}
                                <span className="text-white underline cursor-pointer">
                                    Sign up
                                </span>
                            </p>

                        </form>
                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
}