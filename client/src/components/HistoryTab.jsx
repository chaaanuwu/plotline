import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getHistory } from "../api/history.api";
import MovieCard from "./ui/MovieCard";
import CinemaLoader from "./ui/Loader";

export default function HistoryTab() {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();

    const loadingRef = useRef(false);
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);

    const fetchHistory = async (currentPage) => {
        if (loadingRef.current || !hasMoreRef.current) return;

        loadingRef.current = true;
        setLoading(true);

        try {
            const res = await getHistory(userId, currentPage);
            setHistoryData(prev => [...prev, ...res.data]);
            hasMoreRef.current = res.hasMore;
            pageRef.current = currentPage + 1;
        } catch (error) {
            console.error(error);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        // Reset and fetch if userId changes
        setHistoryData([]);
        pageRef.current = 1;
        hasMoreRef.current = true;
        fetchHistory(1);
    }, [userId]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 400
            ) {
                fetchHistory(pageRef.current);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const grouped = historyData.reduce((acc, item) => {
        const dateKey = formatDate(item.watchedAt);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen pb-20">
            <AnimatePresence mode="popLayout">
                {Object.entries(grouped).map(([date, items], sectionIndex) => (
                    <motion.div 
                        key={date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sectionIndex * 0.1 }}
                        className="mb-12 relative"
                    >
                        {/* THE TIMELINE HEADER */}
                        <div className="sticky top-0 z-10 py-4 bg-white/80 backdrop-blur-md flex items-center gap-4 mb-6">
                            <div className="h-px w-12 bg-amber-600/30" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
                                {date}
                            </h2>
                            <div className="h-px flex-1 bg-stone-100" />
                        </div>

                        {/* MOVIE GRID */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-2">
                            {items.map((h, i) => (
                                <motion.div
                                    key={h._id}
                                    whileHover={{ y: -5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <MovieCard
                                        id={h.movieId._id}
                                        title={h.movieId.title}
                                        poster={h.movieId.posterPath}
                                        rating={h.movieId.voteAverage} // Updated to match typical TMDb naming
                                        releaseDate={h.movieId.releaseDate}
                                    />
                                    {/* Sub-label for exact time if needed */}
                                    <p className="mt-2 text-[9px] font-bold text-stone-300 uppercase tracking-widest text-center">
                                        {new Date(h.watchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* LOADING STATE */}
            {loading && (
                <div className="py-10">
                    <CinemaLoader text="Retrieving Archive" />
                </div>
            )}

            {/* END OF HISTORY MESSAGE */}
            {!hasMoreRef.current && historyData.length > 0 && (
                <p className="text-center text-stone-300 font-serif italic py-10">
                    You've reached the beginning of your journey.
                </p>
            )}

            {/* EMPTY STATE */}
            {!loading && historyData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-300 mb-4 rotate-12">
                        <span className="material-symbols-outlined text-3xl">history</span>
                    </div>
                    <p className="text-stone-400 font-serif italic text-lg">Your screening history is empty.</p>
                </div>
            )}
        </div>
    );
}