import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
import Dropdown from "../components/ui/Dropdown";
import { followUser, unfollowUser } from "../api/userFollows.api";
import { getAllComments, postComment, updateComment } from "../api/commments.api";

export default function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isChangeCoverModalOpen, setIsChangeCoverModalOpen] = useState(false);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [banners, setBanners] = useState([]);
    const [selectedBackdrop, setSelectedBackdrop] = useState(null);
    const user = useUserStore((state) => state.user);
    const { userId } = useParams();
    const commentInputRef = useRef(null);

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await getProfile(userId);
                setProfileData(res);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    // Check following status
    useEffect(() => {
        if (user?.user?._id && profileData?.followers) {
            const loggedInUserId = user.user._id;

            const isFollowing = profileData.followers.some((record) => {
                const followerId = record.followerId?._id || record.followerId || record._id;
                return followerId === loggedInUserId;
            });

            setFollowing(isFollowing);
        }
    }, [profileData, user]);

    const handleFollowToggle = async () => {
        // 1. Store the previous state in case the API fails (to rollback)
        const wasFollowing = following;
        const profileId = profileData.user._id;

        try {
            if (wasFollowing) {
                // UNFOLLOW LOGIC
                const res = await unfollowUser(profileId);
                if (res.status === 200) {
                    setFollowing(false);
                    setProfileData(prev => ({
                        ...prev,
                        followersCount: Math.max(0, (prev.followersCount || 0) - 1),
                        // Remove current user from the local followers array
                        followers: prev.followers.filter(f =>
                            (f.followerId?._id || f.followerId || f._id) !== user.user._id
                        )
                    }));
                }
            } else {
                // FOLLOW LOGIC
                const res = await followUser(profileId);
                if (res.status === 200) {
                    setFollowing(true);
                    setProfileData(prev => ({
                        ...prev,
                        followersCount: (prev.followersCount || 0) + 1,
                        // Add current user to local followers array to keep useEffect happy
                        followers: [...prev.followers, { followerId: user.user._id }]
                    }));
                }
            }
        } catch (error) {
            console.error("Toggle follow failed", error);
            // Optional: Alert the user or rollback UI state
        }
    };

    const handleOpenReplyModal = async (review) => {
        setComments([]);
        setSelectedReview(review);
        setIsReplyModalOpen(true);
        try {
            const res = await getAllComments(review._id);
            setComments(res.comments);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    }

    const handlePostComment = async () => {
        const content = commentInputRef.current.value;
        if (!content.trim()) return;

        try {
            const res = await postComment(selectedReview._id, content);
            if (res.data.success) {
                setComments(prev => [...prev, res.data.comment]);
                commentInputRef.current.value = "";
                commentInputRef.current.style.height = 'auto';
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    }

    const handleUpdateComment = async () => {
        try {
            const res = await updateComment(selectedReview._id, selectedComment, "Updated comment content");
            setSelectedComment(null);
            if (res.data.success) {
                console.log("Comment updated successfully");
            }
        } catch (error) {
            console.error("Failed to update comment", error);
        }
    }

    const handleChangeCover = async () => {
        setIsChangeCoverModalOpen(true);
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
            setIsChangeCoverModalOpen(false);
            setSelectedBackdrop(null);
        } catch (err) {
            console.error("Failed to set profile cover", err);
        }
    }

    if (loading) return <Loader />;

    const isMyProfile = user?.user?._id === profileData?.user?._id;

    return (
        <main className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-amber-100">
            <div className="relative h-64 md:h-96 w-full bg-stone-200 overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    src={profileData.user.cover ? `${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${profileData.user.cover}` : bbBg}
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
                                <ProfileStat count={profileData.followersCount || 0} label="Followers" href="/followers" />
                                <ProfileStat count={profileData.followingCount || 0} label="Following" href="/following" />

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
                                !following ? (
                                    <button
                                        onClick={handleFollowToggle}
                                        className="px-10 py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-800 transition-all shadow-lg active:scale-95">
                                        Follow
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleFollowToggle}
                                        className="px-10 py-4 bg-white border border-stone-200 text-stone-700 rounded-2xl font-bold text-sm hover:bg-stone-50 transition-all shadow-sm active:scale-95">
                                        Unfollow
                                    </button>
                                )
                            ) : (
                                <button className="px-10 py-4 bg-white border border-stone-200 text-stone-600 rounded-2xl font-bold text-sm hover:bg-stone-50 transition-all shadow-sm active:scale-95">
                                    Edit Profile
                                </button>
                            )}

                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-14 h-14 flex items-center justify-center bg-white border border-stone-200 rounded-2xl text-stone-400 hover:text-stone-900 transition-all shadow-sm active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-2xl">more_horiz</span>
                                </button>

                                <Dropdown open={isDropdownOpen} setOpen={setIsDropdownOpen}>
                                    <div className="p-2 min-w-40">
                                        <button className="w-full text-left p-2 text-sm font-bold text-stone-600 hover:bg-stone-50 rounded-lg transition-colors uppercase tracking-wider">
                                            Share Profile
                                        </button>
                                        {isMyProfile && (
                                            <button className="w-full text-left p-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors uppercase tracking-wider">
                                                Settings
                                            </button>
                                        )}
                                    </div>
                                </Dropdown>
                            </div>
                        </motion.div>
                    </div>
                </div>

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

                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pb-24"
                >
                    <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-sm overflow-hidden min-h-125">
                        <Tabs
                            profileData={profileData}
                            isMyProfile={isMyProfile}
                            onReplyClick={handleOpenReplyModal}
                        />
                    </div>
                </motion.section>
            </div>

            {/* Discussion Modal */}
            <Modal open={isReplyModalOpen} setOpen={setIsReplyModalOpen}>
                <div className="flex flex-col h-dvh md:h-[90vh] md:max-h-212.5 w-full max-w-5xl mx-auto bg-white md:rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.25)] relative">
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
                            comments.map((c) => (
                                <motion.div
                                    key={c._id}
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
                                                    {c.userId?.firstName} {c.userId?.lastName}
                                                </p>
                                                <span className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-wider">
                                                    {new Date(c.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {user?.user?._id === c.userId?._id && (
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

            {/* Modal for Cover Selection */}
            <Modal open={isChangeCoverModalOpen} setOpen={setIsChangeCoverModalOpen}>
                <div className="relative flex flex-col h-[90vh] max-h-212.5 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white">
                    <button
                        onClick={() => setIsChangeCoverModalOpen(false)}
                        className="absolute top-8 right-8 z-30 p-3 bg-stone-900/5 hover:bg-amber-400 text-stone-900 rounded-full transition-all duration-300 group"
                    >
                        <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="p-8 md:p-12 border-b border-stone-100 bg-white/90 backdrop-blur-xl sticky top-0 z-20">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pr-16">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-6 bg-amber-400 rounded-full" />
                                    <span className="text-[10px] font-black tracking-[0.4em] text-stone-400 uppercase">Gallery</span>
                                </div>
                                <h3 className="text-4xl font-black text-stone-900 tracking-tighter">
                                    Change <span className="text-stone-400 font-light italic">Cover</span>
                                </h3>
                            </div>
                            <div className="w-full lg:w-112.5">
                                <SearchBar
                                    placeholder="Search for a movie title..."
                                    className="rounded-2xl border-stone-100 focus:ring-amber-400 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-stone-50/50">
                        {banners.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {banners.map((banner, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className={`group relative aspect-video rounded-4xl overflow-hidden cursor-pointer transition-all duration-500
                                        ${selectedBackdrop === banner?.backdropPath
                                                ? "ring-[6px] ring-amber-400 ring-offset-4 shadow-2xl scale-[1.02]"
                                                : "shadow-lg hover:shadow-2xl hover:shadow-stone-200"}`}
                                        onClick={() => setSelectedBackdrop(banner?.backdropPath)}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${banner?.backdropPath}`}
                                            alt={banner?.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent opacity-80" />
                                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                                            <p className="text-white text-2xl font-black tracking-tight drop-shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform">
                                                {banner?.title || "Untitled Cinematic"}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32">
                                <span className="text-6xl mb-4 opacity-20">🎞️</span>
                                <h4 className="text-xl font-bold text-stone-400 uppercase tracking-widest">No scenes found</h4>
                            </div>
                        )}
                    </div>

                    {selectedBackdrop && (
                        <div className="p-8 border-t border-stone-100 bg-white/90 backdrop-blur-md sticky bottom-0 z-20 flex items-center justify-end gap-4">
                            <button
                                onClick={() => setIsChangeCoverModalOpen(false)}
                                className="px-8 py-4 text-stone-400 font-bold hover:text-stone-900 transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleSaveCover}
                                className="px-10 py-4 bg-amber-400 hover:bg-stone-900 hover:text-white text-stone-900 rounded-2xl font-black transition-all shadow-xl shadow-amber-100 active:scale-95"
                            >
                                Apply Cinematic Cover
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
        <a href={href} className="group flex flex-col items-center gap-1">
            <span className="text-xl font-black text-stone-900 group-hover:text-amber-600 transition-colors leading-none">
                {count}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-black text-stone-400">
                {label}
            </span>
        </a>
    );
}