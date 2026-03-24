import { useState } from "react";
import axios from "axios";
import useUserStore from "../../store/userStore";
import { toggleLikeReview } from "../../api/reviews.api";

export default function ReviewCard({
    userId,
    reviewId,
    firstName,
    lastName,
    pfp,
    movieId,
    reviewDate,
    posterUrl,
    backdropUrl,
    reviewText,
    reviewLikes,
    movieTitle,
    releaseYear,
    imdbRating,
    genres,
}) {
    const [isLiked, setIsLiked] = useState(
        Array.isArray(reviewLikes)
            ? reviewLikes.includes(userId)
            : false
    );

    const [likes, setLikes] = useState(
        Array.isArray(reviewLikes) ? reviewLikes.length : (reviewLikes ?? 0)
    );

    const [loading, setLoading] = useState(false);

    const formattedLikes = likes >= 1000 ? (likes / 1000).toFixed(1) + "k" : likes;

    const handleLike = async () => {
        if (loading) return;

        const alreadyLiked = isLiked;

        setIsLiked(!alreadyLiked);
        setLikes((prev) => (alreadyLiked ? prev - 1 : prev + 1));
        setLoading(true);

        try {
            await toggleLikeReview(reviewId);

        } catch (err) {
            // rollback only on failure
            setIsLiked(alreadyLiked);
            setLikes((prev) => (alreadyLiked ? prev + 1 : prev - 1));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full rounded-2xl overflow-hidden bg-white shadow-[0_4px_40px_rgba(0,0,0,0.13)] font-sans">

            {/* BACKDROP */}
            <div
                className="relative w-full h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${backdropUrl})` }}
            >
                <div className="absolute inset-0 bg-linear-to-b from-black/5 to-black/70" />

                <div className="absolute bottom-0 left-0 right-0 pl-32 pr-5 pb-4 pt-3">
                    <a href={`/movies/${movieId}`}>
                        <p className="text-white font-bold text-xl leading-tight tracking-tight drop-shadow-md">
                            {movieTitle}
                        </p>
                    </a>

                    <div className="flex items-center flex-wrap gap-2 mt-1.5">
                        <span className="text-white/70 text-xs font-medium">{releaseYear}</span>
                        <span className="text-white/30 text-xs">•</span>

                        <div className="flex items-center gap-1 bg-black/50 rounded-md px-2 py-0.5">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="#FBBF24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-white text-xs font-bold">{imdbRating}</span>
                        </div>

                        {genres.map((g) => (
                            <span
                                key={g}
                                className="text-white/80 text-[11px] font-medium bg-white/10 border border-white/20 rounded-md px-2 py-0.5"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                </div>

                <img
                    src={posterUrl}
                    alt="Poster"
                    draggable="false"
                    className="absolute -bottom-16 left-5 w-24 h-34.5 object-cover rounded-xl border-[3px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                />
            </div>

            {/* BODY */}
            <div className="px-5 pb-5">
                <div className="h-20" />

                <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                        <img
                            src={pfp}
                            alt="Profile"
                            draggable="false"
                            className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div>
                            <p className="text-sm font-bold text-gray-900 leading-tight">
                                {firstName} {lastName}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5 tracking-wide">
                                {new Date(reviewDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    <button className="p-1 text-gray-400 cursor-pointer bg-transparent border-none">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                        </svg>
                    </button>
                </div>

                <p className="text-sm text-gray-600 leading-[1.75] mb-5">
                    {reviewText}
                </p>

                <div className="h-px bg-gray-100 mb-3.5" />

                {/* ACTIONS */}
                <div className="flex items-center gap-1.5">

                    {/* LIKE BUTTON */}
                    <button
                        onClick={handleLike}
                        disabled={loading}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold
                            cursor-pointer select-none transition-all duration-200
                            ${isLiked
                                ? "bg-rose-500 text-white shadow-[0_2px_12px_rgba(244,63,94,0.3)]"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }
                            ${loading ? "opacity-70 cursor-not-allowed" : ""}
                        `}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={isLiked ? "white" : "none"}
                            stroke={isLiked ? "white" : "currentColor"}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                transition: "fill 0.2s ease, transform 0.2s ease",
                                transform: isLiked ? "scale(1.15)" : "scale(1)",
                            }}
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {formattedLikes}
                    </button>

                    <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white text-[13px] font-semibold text-gray-600 cursor-pointer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Reply
                    </button>

                    <button className="ml-auto flex items-center px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-400 cursor-pointer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}