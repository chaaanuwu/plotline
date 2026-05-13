import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getMovieById } from "../api/movie.api";
import Loader from "../components/ui/Loader";
import Modal from "../components/ui/Modal";
import { addWatchedMovie, getMovieHistory, removeMovieFromHistory, updateRating } from "../api/history.api";
import { addMovieToWatchList, getIsMovieWatchListed, removeMovieFromWatchList } from "../api/watchList.api";
import { BookmarkIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "lucide-react";
import { addMovieReview } from "../api/reviews.api";
import { toast } from "sonner";

export default function MoviePage() {
    const [movieData, setMovieData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [watched, setWatched] = useState(false);
    const [historyEntry, setHistoryEntry] = useState(null);
    const [inList, setInList] = useState(false);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const { movieId } = useParams();

    const reviewRef = useRef(null);

    useEffect(() => {
        if (!movieId) return;
        const fetchMovie = async () => {
            try {
                const res = await Promise.all([
                    getMovieById(movieId),
                    getMovieHistory(movieId),
                    getIsMovieWatchListed(movieId)
                ]);

                setMovieData(res[0]);
                setHistoryEntry(res[1].data);
                setRating(res[1].data ? res[1].data.rating : 0);
                setWatched(res[1].data != null);
                setInList(res[2].data.watchListed);

            } catch (error) {
                console.error("Error fetching movie: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [movieId]);

    const handleWatchedToggle = async () => {
        try {
            if (watched) {
                const res = await removeMovieFromHistory(movieData._id);
                if (res.status === 200) {
                    setWatched(false);
                    setRating(0);
                    toast.success("Movie removed from the watch history.");
                }
            } else {
                const res = await addWatchedMovie(movieData.title);

                if (res.status === 201) {
                    if (inList) setInList(false);

                    setWatched(true);
                    toast.success("Movie added to the watch history.");

                    setMovieData((prev) => ({
                        ...prev,
                        ...res.data
                    }));

                    setHistoryEntry((prev) => ({
                        ...prev,
                        ...res.data.data
                    }));
                }
            }
        } catch (error) {
            toast.error("Failed to add movie to the watch history.");
            console.error("Error updating watch status: ", error);
        }
    }

    const handleWatchListToggle = async () => {
        try {
            if (inList) {
                const res = await removeMovieFromWatchList(movieData._id);
                if (res.status === 200) {
                    setInList(false);
                    toast.success("Movie removed from the watchlist.");
                }
            } else {
                const res = await addMovieToWatchList(movieData.title);
                if (res.status === 201) {
                    setInList(true);
                    toast.success("Movie added to the watchlist.");
                }
            }
        } catch (error) {
            toast.error("Failed to add movie to the watchlist.");
            console.error("Error updating watchlist status: ", error);
        }
    }

    const handleMovieRating = async (rating) => {
        if (!watched) {
            setRating(0);
            toast.info("You need to mark the movie as watched before rating.");
            return;
        } else {
            try {
                const res = await updateRating(historyEntry._id, rating);
                if (res.data.success) {
                    setMovieData((prev) => ({
                        ...prev,
                        ...res.data
                    }));
                    toast.success("Rating updated successfully.");
                }
            } catch (error) {
                toast.error("Failed to update rating.");
                console.error("Error updating rating: ", error);
            }
        }
    }

    const handlePostReview = async () => {
        if (!reviewRef.current || !reviewRef.current.value.trim()) {
            toast.info("Review cannot be empty.");
            return;
        }

        try {
            await addMovieReview(movieData._id, {
                review: reviewRef.current.value.trim()
            });

            setReviewOpen(false);
            reviewRef.current.value = "";

        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.error);
            } else {
                console.error("Error posting review:", error);
            }
        }
    };

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
                            className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter"
                        >
                            {movieData?.title} <span className="font-thin text-stone-400 ml-2">{releaseYear}</span>
                        </motion.h1>

                        {/* Metadata Badges */}
                        <div className="mt-3 flex items-center gap-3">
                            <span className="text-[10px] font-bold border-2 border-stone-800 px-2 py-0.5 rounded text-stone-800 bg-white">
                                {movieData?.originalLanguage?.toUpperCase()}
                            </span>
                            {movieData?.adult && (
                                <span className="text-[10px] font-black text-red-600 border-2 border-red-600 px-2 py-0.5 rounded bg-red-50">
                                    18+
                                </span>
                            )}
                            <div className="h-1 w-1 rounded-full bg-stone-300" />
                            <div className="flex flex-wrap gap-2">
                                {movieData?.genreNames.map((g) => (
                                    <span key={g} className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/*  */}
                        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-6 border-t border-stone-100 pt-6">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
                                    Your Rating
                                </p>
                                <div
                                    className="flex items-center gap-1 group/rating"
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    {[...Array(10)].map((_, i) => {
                                        const starValue = i + 1;
                                        const isActive = starValue <= (hoverRating || rating);
                                        return (
                                            <button
                                                key={starValue}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setRating(starValue);
                                                    handleMovieRating(starValue);
                                                }}
                                                onMouseEnter={() => setHoverRating(starValue)}
                                                className="relative transition-transform hover:scale-125 active:scale-95"
                                            >
                                                <StarIcon
                                                    className={`size-6 md:size-8 transition-colors ${isActive ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-stone-200'
                                                        }`}
                                                />
                                            </button>
                                        );
                                    })}
                                    {(hoverRating || rating) > 0 && (
                                        <span className="ml-4 text-2xl font-black text-stone-900 tabular-nums">
                                            {hoverRating || rating}<span className="text-stone-300 text-sm font-medium">/10</span>
                                        </span>
                                    )}
                                </div>
                            </div>
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

                    <motion.aside
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <ActionButton
                            active={watched}
                            onClick={handleWatchedToggle}
                            activeClass="bg-amber-400 text-white border-amber-400"
                            label={watched ? "Watched" : "Mark as watched"}
                            trueIcon={<ClockIcon className="size-5" />}
                            falseIcon={<CheckCircleIcon className="size-5" />}
                        />
                        <ActionButton
                            active={inList}
                            onClick={handleWatchListToggle}
                            activeClass="bg-(--secondary-color) text-white border-(--secondary-color)"
                            label={inList ? "In Watchlist" : "Add to Watchlist"}
                            trueIcon={<BookmarkIcon className="size-5" />}
                            falseIcon={<BookmarkIcon className="size-5" />}
                        />
                        <div>
                            <button
                                onClick={() => {
                                    watched ?
                                        setReviewOpen(true) : toast.info("You need to mark the movie as watched before posting a review.");
                                }}
                                className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 py-8 text-stone-500 transition-all hover:border-stone-400 hover:bg-white hover:text-stone-800"
                            >
                                <ChatBubbleLeftRightIcon className="size-6" />
                                <span className="text-lg font-semibold">Write a Review</span>
                            </button>

                            {/* Modal for Review */}
                            <Modal open={reviewOpen} setOpen={setReviewOpen}>
                                <div className="relative overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 sm:rounded-2xl w-full max-w-lg mx-auto">

                                    <button
                                        onClick={() => setReviewOpen(false)}
                                        className="absolute right-4 top-4 z-10 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <XMarkIcon className="size-6" />
                                    </button>

                                    <div className="border-b border-stone-100 bg-stone-50/50 px-8 py-6 pr-14">
                                        <h2 className="text-2xl font-bold text-stone-900">Share your thoughts</h2>
                                        <p className="mt-1 text-sm text-stone-500">How was the cinematography and pacing?</p>
                                    </div>

                                    <div className="p-8">
                                        <textarea
                                            ref={reviewRef}
                                            rows={6}
                                            className="w-full rounded-xl border border-stone-300 p-4 text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20"
                                            placeholder="Share your thoughts..."
                                        />

                                        <div className="mt-8 flex justify-end gap-3">
                                            <button
                                                onClick={() => setReviewOpen(false)}
                                                className="rounded-xl px-6 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handlePostReview}
                                                className="rounded-xl bg-stone-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-stone-800"
                                            >
                                                Post Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
}

function ActionButton({ active, onClick, activeClass, label, trueIcon, falseIcon }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border-2 font-bold text-sm transition-all active:scale-95 ${active ? activeClass : "bg-white border-stone-100 text-stone-700 hover:border-stone-200 shadow-sm"
                }`}
        >
            {active ?
                <span className="text-lg">{trueIcon}</span> :
                <span className="text-lg">{falseIcon}</span>
            }
            {label}
        </button>
    );
}