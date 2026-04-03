import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import bbBg from "../assets/bb-bg.jpg";
import defaultPfp from "../assets/default-pfp.jpg";
import Tabs from "../components/Tabs";
import useUserStore from "../store/userStore";
import { getProfile, setProfileCover } from "../api/user.api";
import Loader from "../components/ui/Loader";
import Modal from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import { getHistoryBanner } from "../api/history.api";

export default function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [banners, setBanners] = useState([]);
    const [selectedBackdrop, setSelectedBackdrop] = useState(null);
    const user = useUserStore((state) => state.user);
    const { userId } = useParams();

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile(userId);
                setProfileData(data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    const handleChangeCover = async () => {
        setOpen(true);
        try {
            const bannerData = await getHistoryBanner();
            const movies = bannerData.data.map(item => item.movieId);
            setBanners(movies);
        } catch (err) {
            console.error("Failed to fetch banners", err);
        }
    }

    const handleSaveCover = async () => {
        if (!selectedBackdrop) return;
        try {
            await setProfileCover(selectedBackdrop);
            setProfileData(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    cover: selectedBackdrop
                }
            }));
            setOpen(false);
            setSelectedBackdrop(null);
        } catch (err) {
            console.error("Failed to set profile cover", err);
        }
    }

    if (loading) return <Loader />;

    const isMyProfile = user?.user?._id === profileData?.user?._id;

    return (
        <main className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-amber-100">
            {/* Cover Section */}
            <div className="relative h-64 md:h-96 w-full bg-stone-200 overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    src={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${profileData.user.cover}` || bbBg}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    draggable="false"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-50 via-transparent to-black/20" />

                {isMyProfile && (
                    <button
                        onClick={handleChangeCover}
                        className="absolute bottom-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 z-10">
                        Change Cover
                    </button>
                )}
            </div>

            {/* Profile Info */}
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
                <div className="relative -mt-20 md:-mt-28 flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="relative shrink-0"
                    >
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] border-[6px] border-white overflow-hidden shadow-2xl bg-stone-100">
                            <img
                                src={profileData.user.pfp || defaultPfp}
                                alt="Profile"
                                className="w-full h-full object-cover scale-105"
                                draggable="false"
                            />
                        </div>
                    </motion.div>

                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-stone-900">
                                {profileData.user.firstName} {profileData.user.lastName}
                            </h2>

                            <div className="flex items-center gap-6 mt-4">
                                <ProfileStat count={user.followersCount || 0} label="Followers" href="/followers" />
                                <ProfileStat count={user.followingCount || 0} label="Following" href="/following" />

                                <div className="hidden sm:flex items-center gap-2 text-stone-400 border-l border-stone-200 pl-6 ml-2">
                                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest">
                                        Since {new Date(profileData.user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-3"
                        >
                            {!isMyProfile ? (
                                <button className="px-10 py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-800 transition-all shadow-lg active:scale-95">
                                    Follow
                                </button>
                            ) : (
                                <button className="px-10 py-4 bg-white border border-stone-200 text-stone-600 rounded-2xl font-bold text-sm hover:bg-stone-50 transition-all shadow-sm active:scale-95">
                                    Edit Profile
                                </button>
                            )}

                            <button className="w-14 h-14 flex items-center justify-center bg-white border border-stone-200 rounded-2xl text-stone-400 hover:text-stone-900 transition-all shadow-sm active:scale-95">
                                <span className="material-symbols-outlined text-2xl">more_horiz</span>
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Director Statement */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 mb-12 max-w-3xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-0.5 w-8 bg-amber-500/40" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">
                            Director's Statement
                        </h3>
                    </div>
                    <p className="text-xl md:text-2xl text-stone-500 leading-relaxed font-serif italic">
                        {profileData.user.about ? `“${profileData.user.about}”` : "“This cinephile hasn't written a bio yet, but their taste in movies speaks for itself.”"}
                    </p>
                </motion.section>

                {/* Tabs */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pb-24"
                >
                    <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm overflow-hidden min-h-125">
                        <Tabs profileData={profileData} isMyProfile={isMyProfile} />
                    </div>
                </motion.section>
            </div>

            {/* Modal for Cover Selection */}
            <Modal open={open} setOpen={setOpen}>
                <div className="flex flex-col h-[90vh] max-h-[900px]">
                    {/* Header */}
                    <div className="p-6 md:p-10 border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-3xl font-black text-stone-900 tracking-tighter">
                                    Change Cover
                                </h3>
                                <p className="text-stone-500 mt-1 font-medium">
                                    Browse and select a high-definition cinematic backdrop.
                                </p>
                            </div>
                            <div className="w-full lg:w-96">
                                <SearchBar placeholder="Search for a movie title..." />
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-stone-50/30">
                        {banners.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                {banners.map((banner, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ scale: 1.02 }}
                                        className={`group relative aspect-video rounded-[2rem] overflow-hidden cursor-pointer bg-stone-200 border-4
                                            ${selectedBackdrop === banner?.backdropPath ? "border-amber-500/70" : "border-white"}
                                            shadow-xl transition-all hover:shadow-amber-500/20 hover:border-amber-500/40`}
                                        onClick={() => {
                                            setSelectedBackdrop(banner?.backdropPath); // ✅ Select banner
                                        }}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${banner?.backdropPath}`}
                                            alt={banner?.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                                        <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex items-center justify-between">
                                                <div className="max-w-[80%]">
                                                    <p className="text-white text-xl font-bold leading-tight drop-shadow-md">
                                                        {banner?.title || "Untitled Cinematic"}
                                                    </p>
                                                    <p className="text-amber-400 text-xs font-black uppercase tracking-[0.2em] mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                                        Click to Apply
                                                    </p>
                                                </div>
                                                <div className="size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-20">
                                <div className="size-20 bg-stone-100 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner">
                                    🔍
                                </div>
                                <h4 className="text-xl font-bold text-stone-900">No results found</h4>
                                <p className="text-stone-500 mt-2">Try searching for a different cinematic masterpiece.</p>
                            </div>
                        )}
                    </div>

                    {/* ✅ Save & Cancel Buttons */}
                    {selectedBackdrop && (
                        <div className="p-6 border-t border-stone-100 bg-white/80 backdrop-blur-md sticky bottom-0 flex justify-end gap-4">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-6 py-3 bg-stone-200 rounded-xl font-bold hover:bg-stone-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveCover} // ✅ Save cover on click
                                className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all"
                            >
                                Save Cover
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </main>
    );
}

function ProfileStat({ count, label, href }) {
    return (
        <a href={href} className="group flex flex-col items-start gap-1">
            <span className="text-xl font-black text-stone-900 group-hover:text-amber-600 transition-colors leading-none">
                {count}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-black text-stone-400">
                {label}
            </span>
        </a>
    );
}