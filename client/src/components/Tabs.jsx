import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "./ui/ReviewCard";
import defaultPfp from "../assets/default-pfp.jpg";
import { getMyReviews, getUserReviews } from "../api/reviews.api";
import MovieCard from "./ui/MovieCard";
import HistoryTab from "./HistoryTab";
import Loader from "./ui/Loader";

export default function Tabs({ profileData, isMyProfile }) {
    const [activeTab, setActiveTab] = useState("reviews");
    const [tabContent, setTabContent] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTabContent = async () => {
            try {
                if (!profileData) return;
                setLoading(true);

                let response;
                if (activeTab === "reviews") {
                    response = isMyProfile
                        ? await getMyReviews()
                        : await getUserReviews(profileData.user._id);
                }

                // Placeholder for other tabs
                if (response) {
                    setTabContent(response.data);
                } else {
                    setTabContent(null);
                }
            } catch (error) {
                console.error("Error fetching tab content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTabContent();
    }, [activeTab, profileData, isMyProfile]);

    return (
        <div className="w-full">
            {/* 1. CINEMATIC TAB NAVIGATION */}
            <div className="border-b border-stone-100 px-6 md:px-10 bg-white/50 backdrop-blur-sm sticky top-0 z-30">
                <div className="flex gap-10">
                    {["reviews", "history", "watchlist"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="relative py-6 group"
                        >
                            <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${
                                activeTab === tab ? "text-amber-600" : "text-stone-400 group-hover:text-stone-600"
                            }`}>
                                {tab}
                            </span>
                            
                            {activeTab === tab && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600 rounded-t-full"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. CONTENT AREA */}
            <div className="p-6 md:p-10 min-h-100">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                        >
                            <Loader />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {activeTab === "reviews" && (
                                <div className="grid grid-cols-1 gap-8">
                                    {tabContent?.reviews?.length > 0 ? (
                                        tabContent.reviews.map((r) => (
                                            <ReviewCard
                                                key={r._id}
                                                userId={profileData.user._id}
                                                firstName={r.user?.firstName ?? profileData.user.firstName}
                                                lastName={r.user?.lastName ?? profileData.user.lastName}
                                                pfp={r.user?.pfp ?? profileData.user.pfp ?? defaultPfp}
                                                reviewId={r?._id}
                                                movieId={r.movieId?._id}
                                                reviewDate={new Date(r.createdAt).toLocaleDateString()}
                                                movieTitle={r.movieId?.title}
                                                posterUrl={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${r.movieId?.posterPath}`}
                                                backdropUrl={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${r.movieId?.backdropPath}`}
                                                releaseYear={r.movieId?.releaseDate?.split("-")[0]}
                                                genres={r.movieId?.genreNames}
                                                reviewText={r?.review}
                                                reviewLikes={r?.likedBy}
                                                rating={r?.rating}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message={`No ${activeTab} found yet.`} />
                                    )}
                                </div>
                            )}

                            {activeTab === "history" && <HistoryTab />}
                            
                            {activeTab === "watchlist" && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {/* Map your watchlist here when ready */}
                                    <EmptyState message="Your watchlist is waiting for its first entry." />
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* Helper Component for Empty States */
function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-300 mb-4">
                <span className="material-symbols-outlined text-3xl">movie_filter</span>
            </div>
            <p className="text-stone-400 font-serif italic text-lg">{message}</p>
        </div>
    );
}