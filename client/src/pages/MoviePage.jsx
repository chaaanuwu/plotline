import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMovieById } from "../api/movie.api";
import Loader from "../components/ui/Loader";

export default function MoviePage() {
    const [movieData, setMovieData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [watched, setWatched] = useState(false);
    const [inList, setInList] = useState(false);
    const [reviewOpen, setReviewOpen] = useState(false);

    const movieId = window.location.pathname.split("/movies/")[1];

    useEffect(() => {
        if (!movieId) return;
        const fetchMovie = async () => {
            try {
                const res = await getMovieById(movieId);
                setMovieData(res.movie || res);
            } catch (error) {
                console.error("Error fetching movie: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [movieId]);

    if (loading) return <Loader />;

    const releaseYear = movieData ? new Date(movieData.releaseDate).getFullYear() : "";

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-amber-200">

            <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden bg-stone-900">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1.2 }}
                    src={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${movieData?.backdropPath}`}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-stone-50 via-stone-50/20 to-transparent" />
            </div>

            <div className="max-w-5xl mx-auto px-6 lg:px-8">

                <div className="relative -mt-32 md:-mt-48 flex flex-col md:flex-row gap-8 items-start md:items-end">
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="shrink-0 group relative"
                    >
                        <img
                            src={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${movieData?.posterPath}`}
                            alt={movieData?.title}
                            className="w-40 md:w-56 rounded-2xl shadow-2xl border-[6px] border-white transition-transform duration-500 group-hover:scale-[1.02]"
                            style={{ aspectRatio: "2/3" }}
                            draggable="false"
                        />
                    </motion.div>

                    <div className="flex-1 pb-4">
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight"
                        >
                            {movieData?.title} <span className="font-light text-stone-400">{releaseYear}</span>
                            <br />
                            <span className="text-sm border-2 p-1 rounded-sm">{movieData?.originalLanguage?.toUpperCase()}</span>
                            {movieData?.adult == true && <span className="text-sm text-red-500 border-2 p-1 rounded-sm font-bold ml-2">18+</span>}
                        </motion.h1>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {movieData?.genreNames.map((g) => (
                                <span key={g} className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-white border border-amber-600 text-amber-600">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 pb-24">
                    {/* Overview */}
                    <div className="space-y-10">
                        <motion.section
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">Overview</h3>
                            <p className="text-lg text-stone-600 leading-relaxed font-serif">
                                {movieData?.overview}
                            </p>
                        </motion.section>
                    </div>

                    {/* Action Buttons */}
                    <motion.aside
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <ActionButton
                            active={watched}
                            onClick={() => setWatched(!watched)}
                            activeClass="bg-(--interaction-color) text-white border-(--interaction-color)"
                            label={watched ? "Watched" : "Mark as watched"}
                            icon={watched ? "✓" : "○"}
                        />
                        <ActionButton
                            active={inList}
                            onClick={() => setInList(!inList)}
                            activeClass="bg-(--secondary-color) text-white border-(--secondary-color)"
                            label={inList ? "In Watchlist" : "Add to Watchlist"}
                            icon="+"
                        />
                        <button
                            onClick={() => setReviewOpen(!reviewOpen)}
                            className="w-full py-4 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-all font-medium text-sm"
                        >
                            {reviewOpen ? "Close Review" : "Write a Review"}
                        </button>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
}

function ActionButton({ active, onClick, activeClass, label, icon }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border-2 font-bold text-sm transition-all active:scale-95 ${active ? activeClass : "bg-white border-stone-100 text-stone-700 hover:border-stone-200 shadow-sm"
                }`}
        >
            <span className="text-lg">{icon}</span>
            {label}
        </button>
    );
}