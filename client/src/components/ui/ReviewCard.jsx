import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toggleLikeReview } from "../../api/reviews.api";
import { shareReview } from "../../api/share.api";
import Modal from "./Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ReviewCard({
    currentUserId,
    reviewId,
    firstName,
    lastName,
    pfp,
    userId,
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
    onReplyClick
}) {

    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const [isReviewShareModalOpen, setIsReviewShareModalOpen] = useState(false);
    const [reviewImage, setReviewImage] = useState(null);
    const [reviewUrl, setReviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const formattedLikes =
        likes >= 1000 ? (likes / 1000).toFixed(1) + "k" : likes;

    // ✅ FIX: proper sync (no stale state issue)
    useEffect(() => {
        if (Array.isArray(reviewLikes)) {

            setLikes(reviewLikes.length);

            const liked = reviewLikes.some((like) =>
                String(like?._id || like) === String(currentUserId)
            );

            setIsLiked(liked);

        } else if (typeof reviewLikes === "number") {
            setLikes(reviewLikes);
        }
    }, [reviewLikes, currentUserId]);

    // 🔥 FIXED LIKE LOGIC ONLY (UI unchanged)
    const handleLike = async () => {
        if (loading || !currentUserId) return;

        const alreadyLiked = isLiked;

        setIsLiked(!alreadyLiked);
        setLikes((prev) => (alreadyLiked ? prev - 1 : prev + 1));
        setLoading(true);

        try {
            const response = await toggleLikeReview(reviewId);

            if (response?.data) {
                if (typeof response.data.isLiked !== "undefined") {
                    setIsLiked(response.data.isLiked);
                }

                if (typeof response.data.likesCount !== "undefined") {
                    setLikes(response.data.likesCount);
                }
            }

        } catch (err) {
            setIsLiked(alreadyLiked);
            setLikes((prev) => (alreadyLiked ? prev + 1 : prev - 1));
            console.error("Like error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewShare = async () => {
        try {
            setIsReviewShareModalOpen(true);

            const res = await shareReview(reviewId);

            const bufferArray = new Uint8Array(res.data.image.data);
            const blob = new Blob([bufferArray], { type: "image/png" });
            const blobUrl = URL.createObjectURL(blob);

            setReviewImage(blobUrl);
            setReviewUrl(res.data.reviewToLink);

        } catch (error) {
            console.error("Failed to fetch review image:", error);
        }
    };

    const handleShareReviewImage = async () => {
        try {
            const response = await fetch(reviewImage);
            const blob = await response.blob();

            const file = new File(
                [blob],
                `${movieTitle}-review.png`,
                { type: "image/png" }
            );

            const shareText =
                `Just posted my review for "${movieTitle}" on PlotLine!\n${reviewUrl}`;

            if (
                navigator.canShare &&
                navigator.canShare({ files: [file], text: shareText })
            ) {
                await navigator.share({
                    files: [file],
                    title: `${movieTitle} Review`,
                    text: shareText
                });
            } else {
                window.open(
                    `https://wa.me/?text=${encodeURIComponent(shareText)}`,
                    "_blank"
                );
            }

        } catch (err) {
            console.error("Share failed:", err);
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
                            <span className="text-white text-xs font-bold">
                                {imdbRating}
                            </span>
                        </div>

                        {genres?.map((g) => (
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
                        <Link to={`/user/${userId}`}>
                            <img
                                src={pfp}
                                alt="Profile"
                                draggable="false"
                                className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                            />
                        </Link>

                        <div>
                            <Link to={`/user/${userId}`}>
                                <p className="text-stone-700 text-sm mt-0.5 tracking-wide">
                                    {firstName} {lastName}
                                </p>
                            </Link>

                            <p className="text-[11px] text-gray-400 mt-0.5 tracking-wide">
                                {new Date(reviewDate).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    }
                                )}
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

                <div className="flex items-center gap-1.5">

                    {/* LIKE BUTTON (UNCHANGED UI) */}
                    <button
                        onClick={handleLike}
                        disabled={loading || !currentUserId}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold
                            cursor-pointer select-none transition-all duration-200
                            ${isLiked
                                ? "bg-rose-500 text-white shadow-[0_2px_12px_rgba(244,63,94,0.3)]"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }
                            ${(loading || !currentUserId)
                                ? "opacity-70 cursor-not-allowed"
                                : ""
                            }
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

                    <button
                        onClick={onReplyClick}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white text-[13px] font-semibold text-gray-600 cursor-pointer"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Reply
                    </button>

                    <button
                        onClick={handleReviewShare}
                        className="ml-auto flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-amber-400 bg-white text-amber-600 text-[13px] font-semibold cursor-pointer"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                        Share
                    </button>
                </div>

                <Modal open={isReviewShareModalOpen} setOpen={setIsReviewShareModalOpen}>
                    <div className="relative flex flex-col lg:flex-row h-dvh lg:h-[90vh] w-full lg:w-[95vw] max-w-7xl bg-white overflow-hidden md:rounded-4xl lg:rounded-[2.5rem] shadow-2xl">

                        {/* Close Button */}
                        <button
                            onClick={() => setIsReviewShareModalOpen(false)}
                            className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-stone-900 shadow-md hover:bg-stone-100 transition-all active:scale-95"
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-xl" />
                        </button>

                        {/* Image Preview Area */}
                        <div className="relative flex-[1.4] bg-stone-50 flex items-center justify-center p-6 lg:p-16 border-b lg:border-b-0 lg:border-r border-stone-100 overflow-hidden min-h-75">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_10%,rgba(251,191,36,0.08)_0%,transparent_50%)]" />

                            {reviewImage ? (
                                <div className="relative z-10 w-full h-full flex items-center justify-center">
                                    <img
                                        src={reviewImage}
                                        alt="Review Share"
                                        className="max-h-full max-w-full object-contain rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-4 lg:border-12 border-white transition-transform duration-700"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-400 rounded-full animate-spin" />
                                    <p className="text-stone-400 text-xs font-black tracking-[0.3em] uppercase">
                                        Generating...
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Area */}
                        <div className="flex-[0.8] flex flex-col p-8 lg:p-14 bg-white">
                            <div className="mb-8 lg:mb-12">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-1 w-8 bg-amber-400 rounded-full" />
                                    <span className="text-[11px] font-black tracking-[0.4em] text-stone-400 uppercase">
                                        Studio Export
                                    </span>
                                </div>

                                <h3 className="text-4xl lg:text-5xl font-black text-stone-900 tracking-tighter leading-tight">
                                    Share <br className="hidden lg:block" />
                                    <span className="text-amber-400">Review.</span>
                                </h3>
                            </div>

                            <div className="space-y-4 lg:space-y-6 flex-1">

                                <button
                                    disabled={!reviewImage}
                                    onClick={handleShareReviewImage}
                                    className="w-full group flex items-center justify-center gap-3 px-8 py-5 bg-amber-400 hover:bg-amber-500 text-stone-900 rounded-2xl transition-all duration-300 shadow-lg shadow-amber-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    <FontAwesomeIcon icon={faShareNodes} className="text-lg" />
                                    <span className="font-bold text-lg">Share to Apps</span>
                                </button>

                                <button
                                    disabled={!reviewImage}
                                    onClick={() => {
                                        if (reviewImage) {
                                            const link = document.createElement("a");
                                            link.href = reviewImage;
                                            link.download = `${movieTitle}_Review.png`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }
                                    }}
                                    className="w-full group flex items-center justify-center gap-3 px-8 py-5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl transition-all duration-300 shadow-xl active:scale-[0.97] disabled:opacity-50"
                                >
                                    <span className="font-bold text-lg">Download HD</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>

                            </div>

                            <div className="mt-8 lg:mt-auto pt-4 flex items-center justify-center lg:justify-between border-t border-stone-50">
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                                    PlotLine
                                </p>
                                <div className="hidden lg:flex gap-1">
                                    <div className="w-8 h-1 rounded-full bg-amber-400" />
                                    <div className="w-4 h-1 rounded-full bg-stone-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}