import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    History,
    Star,
    Users,
    Layout,
    UserPlus,
    Film,
    Home
} from 'lucide-react';
import { getLandingImage } from '../api/tmdb.api';

export default function Landing() {
    const [heroImage, setHeroImage] = useState(null);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchLandingImage = async () => {
            try {
                const res = await getLandingImage();
                const imgUrl = res.data?.backdropPath;

                setHeroImage(imgUrl);

            } catch (error) {
                console.error("Error fetching landing image:", error);
            }
        };

        fetchLandingImage();
    }, []);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const navTo = (path) => {
        window.location.href = path;
    };

    const handleScrollToExplore = () => {
        document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    };

    return (
        <div className="min-h-screen bg-black text-slate-100 selection:bg-amber-500/30" style={{ fontFamily: 'Lamber-500, sans-serif' }}>
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-white/8">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="text-3xl font-black tracking-tighter text-white uppercase cursor-pointer" onClick={() => navTo('/')}>
                        Plot<span className="text-amber-500 font-bold">Line</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navTo('/login')}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 backdrop-blur-sm"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black">

                {/* Background Image */}
                {heroImage && (
                    <motion.img
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        src={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${heroImage}`}
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    />
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/25 to-black/50" />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-black/70" />

                {/* Ambient Glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-200 h-75 sm:h-125 bg-amber-500/15 blur-[120px] sm:blur-[180px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 flex flex-col items-center text-center gap-6 sm:gap-10 pt-28 sm:pt-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-4xl leading-tight sm:leading-[1.05]"
                    >
                        Your <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-500 to-orange-500">Movies</span>.<br className="hidden sm:block" />
                        Your <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-500 to-orange-500">Reviews</span>.<br />
                        <span className="block sm:inline text-slate-200 font-extrabold text-3xl sm:text-5xl md:text-7xl lg:text-8xl lowercase tracking-wide mt-2 sm:mt-0">all in one place.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed px-2 sm:px-0"
                    >
                        PlotLine helps you discover films, track what you watch, and build a personal movie journey with reviews and community insights.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mt-2 w-full max-w-sm sm:max-w-none px-4 sm:px-0"
                    >
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navTo('/signup')}
                            className="bg-amber-500 text-black px-8 py-4 sm:px-12 sm:py-5 rounded-xl text-base sm:text-lg font-bold hover:bg-amber-400 transition-all duration-300 shadow-2xl shadow-amber-500/25 tracking-wide text-center"
                        >
                            Get Started
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleScrollToExplore}
                            className="bg-white/10 text-white border border-white/20 px-8 py-4 sm:px-12 sm:py-5 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 tracking-wide backdrop-blur-sm text-center"
                        >
                            Explore Platform
                        </motion.button>
                    </motion.div>

                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer"
                    onClick={handleScrollToExplore}
                >
                    <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                        />
                    </div>
                </motion.div>
            </section>

            <section id="explore" className="py-40 bg-black relative overflow-hidden">
                {/* ambient gradients */}
                <div className="absolute top-0 right-0 w-150 h-150 bg-amber-500/5 blur-[200px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-125 h-125 bg-indigo-500/5 blur-[180px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-8">

                    <div className="text-center mb-24">
                        <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-500 mb-4">
                            Why PlotLine
                        </h2>
                        <p className="text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto">
                            Everything you need to own your film journey.
                        </p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
                    >
                        <FeatureCard
                            icon={<Star size={28} className="text-amber-500" />}
                            title="Rich Reviews"
                            desc="Write detailed reviews with ratings, tone tags, and structured critiques that help others discover great films."
                        />
                        <FeatureCard
                            icon={<History size={28} className="text-indigo-400" />}
                            title="Watch History"
                            desc="Automatically log every film you watch with dates and notes—build your complete cinematic timeline."
                        />
                        <FeatureCard
                            icon={<Layout size={28} className="text-amber-500" />}
                            title="Live Feed"
                            desc="See what your friends are watching in real-time. Share discoveries and discuss as you watch."
                        />
                        <FeatureCard
                            icon={<Search size={28} className="text-indigo-400" />}
                            title="Smart Discovery"
                            desc="Search and filter by genre, mood, director, decade, and more. Find your next favorite film instantly."
                        />
                        <FeatureCard
                            icon={<Users size={28} className="text-amber-500" />}
                            title="Community"
                            desc="Join a network of passionate film lovers. Follow critics, share recommendations, and grow your list."
                        />
                        <FeatureCard
                            icon={<Film size={28} className="text-indigo-400" />}
                            title="Analytics"
                            desc="Visualize your watching habits with beautiful charts. Discover your taste profile over time."
                        />
                    </motion.div>
                </div>
            </section>

            <section className="py-40 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 to-transparent pointer-events-none" />

                <div className="max-w-6xl mx-auto px-8">

                    {/* Header */}
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-500 mb-4">
                            The Experience
                        </h2>
                        <p className="text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto">
                            Built for those who take film seriously.
                        </p>
                    </motion.div>

                    {/* App Preview */}
                    <motion.div
                        {...fadeInUp}
                        className="relative bg-[#0E0E10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black"
                    >
                        {/* Top Bar */}
                        <div className="h-12 bg-black/50 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                            <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            <div className="ml-4 text-xs text-slate-500 font-mono">plotline.app</div>
                        </div>

                        {/* App Content Preview */}
                        <div className="p-8 text-white select-none pointer-events-none">
                            {/* Hero */}
                            <div className="h-48 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl mb-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <div className="text-xs text-amber-500 font-bold tracking-widest uppercase mb-1">Now Playing</div>
                                    <div className="text-2xl font-black">Dune: Part Two</div>
                                </div>
                            </div>

                            {/* Cards Row */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="aspect-2/3 bg-slate-800 rounded-lg" />
                                <div className="aspect-2/3 bg-slate-800 rounded-lg" />
                                <div className="aspect-2/3 bg-slate-800 rounded-lg" />
                                <div className="aspect-2/3 bg-slate-800 rounded-lg" />
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-40 bg-black border-t border-white/5 relative">
                <div className="absolute inset-0 bg-linear-to-b from-black via-amber-500/2 to-black pointer-events-none" />

                <div className="max-w-7xl mx-auto px-8 relative z-10">

                    <div className="text-center mb-20">
                        <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-500 mb-4">
                            How It Works
                        </h2>
                        <p className="text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto">
                            Four steps to total film mastery.
                        </p>
                    </div>

                    {/* Steps Container */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <Step number="01" title="Create Account" desc="Sign up in seconds. No credit card required." icon={<UserPlus size={24} className="text-amber-500" />} />
                        <Step number="02" title="Discover" desc="Search millions of movies and find hidden gems." icon={<Search size={24} className="text-indigo-400" />} />
                        <Step number="03" title="Log & Rate" desc="Track what you watch and share your reviews." icon={<Star size={24} className="text-amber-500" />} />
                        <Step number="04" title="Build Collection" desc="Create your personal archive of favorites." icon={<History size={24} className="text-indigo-400" />} />
                    </div>
                </div>
            </section>

            <section className="py-40 relative overflow-hidden bg-black">
                <div className="absolute inset-0 bg-linear-to-t from-amber-500/10 to-transparent pointer-events-none" />

                <div className="max-w-4xl mx-auto px-8 relative z-10">
                    <motion.div
                        {...fadeInUp}
                        whileHover={{ scale: 1.01 }}
                        className="bg-linear-to-br from-[#121214] via-[#0E0E10] to-black border border-white/10 rounded-3xl p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-black"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/8 rounded-full blur-[160px] pointer-events-none" />

                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-8 max-w-2xl mx-auto leading-tight">
                            Start your journey.
                        </h2>
                        <p className="text-slate-400 mb-12 text-xl max-w-lg mx-auto font-light">
                            Join thousands of film lovers tracking their cinematic journey on PlotLine.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navTo('/signup')}
                            className="bg-amber-500 text-black px-12 py-5 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/25 text-lg"
                        >
                            Get Started Free
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-black">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">

                    <div className="text-2xl font-black tracking-tighter text-white uppercase">
                        Plot<span className="text-amber-500 font-bold">Line</span>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-slate-400">
                        <button onClick={() => navTo('/login')} className="hover:text-white transition-colors">Sign In</button>
                        <button onClick={() => navTo('/signup')} className="hover:text-white transition-colors">Get Started</button>
                    </div>

                    <div className="text-xs font-mono tracking-widest text-slate-600">
                        © {new Date().getFullYear()} PLOTLINE
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Sub-components (Kept exactly identical to preserve layouts)
function FeatureCard({ icon, title, desc }) {
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="group relative bg-white/2 border border-white/8 hover:border-amber-500/30 p-10 rounded-3xl transition-all duration-500 backdrop-blur-sm"
        >
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 group-hover:border-amber-500/40 group-hover:bg-amber-500/8 flex items-center justify-center mb-8 transition-all duration-500">
                <div className="group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
                {desc}
            </p>
        </motion.div>
    );
}

function Step({ number, title, desc, icon }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex gap-6 items-start group"
        >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 flex items-center justify-center transition-all duration-500 relative shrink-0">
                {icon}
                <span className="absolute -bottom-3 -right-3 bg-black border border-white/10 text-xs font-bold text-amber-500 px-2 py-1 rounded">
                    {number}
                </span>
            </div>

            <div className="pt-2">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-slate-400 text-base font-light leading-relaxed">
                    {desc}
                </p>
            </div>
        </motion.div>
    );
}