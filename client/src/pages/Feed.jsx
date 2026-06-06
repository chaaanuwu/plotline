import { useEffect, useState, useRef } from "react";
import { getFeedReviews } from "../api/feed.api";
import ReviewCard from "../components/ui/ReviewCard";
import Loader from "../components/ui/Loader";
import useUserStore from "../store/userStore";
import defaultPfp from "../assets/default-pfp.jpg";
import Modal from "../components/ui/Modal";
import { motion } from "framer-motion";
import { getAllComments, postComment } from "../api/commments.api";
import { toast } from "sonner";

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const commentInputRef = useRef(null);

    const user = useUserStore((state) => state.user);
    const loggedInUserId = user?._id;

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await getFeedReviews();
                setFeed(res?.data?.feed || []);
            } catch (error) {
                console.error("Error fetching feed: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    const handleOpenReplyModal = async (review) => {
        setComments([]);
        setSelectedReview(review);
        setIsReplyModalOpen(true);
        try {
            const res = await getAllComments(review._id);
            let fetchedComments = res.comments || res.data?.comments || [];
            setComments(fetchedComments);
        } catch (error) {
            console.error("Failed to fetch comments", error);
            toast.error("Failed to load comments");
            setComments([]);
        }
    };

    const handlePostComment = async () => {
        if (!selectedReview?._id) {
            toast.error("Cannot post comment: No review selected");
            return;
        }
        
        const content = commentInputRef.current?.value;
        if (!content?.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        // Create a temporary comment with a more unique ID
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const tempComment = {
            _id: tempId,
            comment: content,
            createdAt: new Date().toISOString(),
            userId: {
                _id: user?._id,
                firstName: user?.firstName || "Loading...",
                lastName: user?.lastName || "",
                pfp: user?.pfp || defaultPfp
            }
        };
        
        // Add temp comment immediately
        setComments(prev => [...prev, tempComment]);
        
        // Clear input
        if (commentInputRef.current) {
            commentInputRef.current.value = "";
            commentInputRef.current.style.height = 'auto';
        }

        try {
            const res = await postComment(selectedReview._id, content);
            
            if (res && (res.status === 200 || res.status === 201 || res.success === true || res.data?.success)) {
                toast.success("Comment posted!");
                
                const updatedComments = await getAllComments(selectedReview._id);
                const commentsList = updatedComments?.comments || updatedComments?.data?.comments || [];
                setComments(commentsList);
            } else {
                // If post failed, remove the temp comment
                setComments(prev => prev.filter(c => c._id !== tempId));
                toast.error("Failed to post comment");
            }
        } catch (error) {
            setComments(prev => prev.filter(c => c._id !== tempId));
            console.error("Failed to post comment", error);
            toast.error(error?.response?.data?.message || "Failed to post comment");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8 border-b border-stone-200 pb-4">
                <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                    Movie <span className="text-amber-500">Feed</span>
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    See what the community is watching and reviewing.
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                {feed.length > 0 ? (
                    feed.map((r) => (
                        <div
                            key={r._id}
                            className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 hover:border-stone-300 transition-colors duration-200 w-full"
                        >
                            <ReviewCard
                                userId={r.userId?._id}
                                firstName={r.userId?.firstName}
                                lastName={r.userId?.lastName}
                                pfp={r.userId?.pfp ?? defaultPfp}
                                reviewId={r?._id}
                                movieId={r.movieId?._id}
                                reviewDate={
                                    r.createdAt
                                        ? new Date(r.createdAt).toLocaleDateString()
                                        : ""
                                }
                                movieTitle={r.movieId?.title}
                                posterUrl={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${r.movieId?.posterPath}`}
                                backdropUrl={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${r.movieId?.backdropPath}`}
                                releaseYear={r.movieId?.releaseDate?.split("-")[0]}
                                genres={r.movieId?.genreNames}
                                reviewText={r?.review}
                                reviewLikes={r?.likedBy || []}
                                rating={r?.rating}
                                onReplyClick={() => handleOpenReplyModal(r)}
                                currentUserId={loggedInUserId}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-stone-100">
                        <p className="text-stone-400 font-medium">
                            Your feed is looking empty. Follow users to see reviews!
                        </p>
                    </div>
                )}
            </div>

            {/* Discussion Modal */}
            <Modal open={isReplyModalOpen} setOpen={setIsReplyModalOpen}>
                <div className="flex flex-col h-screen md:h-[90vh] md:max-h-212.5 w-full max-w-5xl mx-auto bg-white md:rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.25)] relative">
                    <div className="px-4 py-4 md:px-12 md:py-10 flex items-center justify-between border-b border-stone-100 bg-white/95 backdrop-blur-md z-20 shrink-0">
                        <div className="space-y-1.5 md:space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="h-0.5 w-5 md:w-6 bg-amber-500" />
                                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-amber-500">
                                    Discussion
                                </h3>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-stone-900">
                                PlotLine Community<span className="text-amber-500">.</span>
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsReplyModalOpen(false)}
                            className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-stone-100 hover:bg-amber-400 text-stone-900 rounded-full transition-all group active:scale-95 shrink-0"
                        >
                            <span className="material-symbols-outlined text-xl md:text-2xl group-hover:rotate-90 transition-transform">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 md:px-16 md:py-12 space-y-6 md:space-y-10 custom-scrollbar bg-stone-50/20">
                        {comments?.length > 0 ? (
                            comments.map((c, index) => (
                                <motion.div
                                    key={c?._id || `comment-${index}-${c?.createdAt || Date.now()}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 md:gap-6 group items-start max-w-4xl"
                                >
                                    <img
                                        src={c.userId?.pfp || defaultPfp}
                                        className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl object-cover shrink-0 shadow-md border-2 border-white ring-1 ring-stone-100"
                                        alt="User"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                                <p className="text-sm md:text-base font-black text-stone-900">
                                                    {c.userId?.firstName || 'Anonymous'} {c.userId?.lastName || ''}
                                                </p>
                                                <span className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-wider">
                                                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now'}
                                                </span>
                                            </div>
                                            {user?._id === c.userId?._id && (
                                                <button className="opacity-100 md:opacity-0 group-hover:md:opacity-100 p-2 -m-1 text-stone-400 hover:text-stone-900 transition-all active:text-stone-900">
                                                    <span className="material-symbols-outlined text-lg md:text-xl">more_horiz</span>
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-stone-600 text-[14px] md:text-[16px] leading-relaxed font-medium bg-white p-4 md:p-6 rounded-2xl md:rounded-4xl rounded-tl-none border border-stone-100 shadow-sm w-full wrap-break-word">
                                            {c.comment}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-12 md:py-20">
                                <span className="material-symbols-outlined text-5xl md:text-7xl mb-3 md:mb-4">forum</span>
                                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center">Be the first to speak</p>
                            </div>
                        )}
                    </div>

                    <div className="shrink-0 p-4 md:p-10 bg-white border-t border-stone-100">
                        <div className="max-w-4xl mx-auto flex items-end gap-2 md:gap-6">
                            <div className="flex-1 relative group flex items-center">
                                <textarea
                                    ref={commentInputRef}
                                    rows="1"
                                    placeholder="Share your thoughts..."
                                    className="w-full max-h-32 p-3 md:p-6 pr-10 md:pr-14 bg-stone-50 border-2 border-transparent focus:border-amber-400/20 focus:bg-white rounded-xl md:rounded-4xl outline-none transition-all duration-300 text-stone-800 font-medium leading-relaxed resize-none overflow-y-auto shadow-inner text-sm md:text-base"
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                                    }}
                                />
                                <div className="absolute right-3 bottom-3 md:right-6 md:bottom-6 text-stone-300">
                                    <span className="material-symbols-outlined text-lg md:text-xl">chat_bubble</span>
                                </div>
                            </div>
                            <button
                                onClick={handlePostComment}
                                className="h-12 md:h-18 px-6 md:px-12 bg-stone-900 hover:bg-amber-400 text-white hover:text-stone-900 rounded-xl md:rounded-4xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-1 md:gap-3 shrink-0"
                            >
                                <span className="hidden sm:inline">Post Reply</span>
                                <span className="material-symbols-outlined text-base md:text-xl sm:hidden">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}