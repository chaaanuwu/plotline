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
import { followUser } from "../api/userFollows.api";
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
                const res = await getProfile(userId);
                setProfileData(res);
                console.log(res);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    const handleFollow = async () => {
        try {
            const res = await followUser(profileData.user._id);
            if (res.status === 200) {
                setFollowing(true);
            }
        } catch (error) {
            console.error("Failed to follow user", error);
        }
    }

    const handleOpenReplyModal = async (review) => {
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
        console.log(commentInputRef.current.value);
        try {
            const res = await postComment(selectedReview._id, commentInputRef.current.value);
            if (res.data.success) {
                console.log("Comment posted successfully");
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
            {/* Cover Section */}
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
                                !following ? (
                                    <button
                                        onClick={handleFollow}
                                        className="px-10 py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-800 transition-all shadow-lg active:scale-95">
                                        Follow
                                    </button>
                                ) : (
                                    <button className="px-10 py-4 bg-white border border-stone-200 text-stone-600 rounded-2xl font-bold text-sm hover:bg-stone-50 transition-all shadow-sm active:scale-95">
                                        Unfollow
                                    </button>
                                )
                            ) : (
                                <button className="px-10 py-4 bg-white border border-stone-200 text-stone-600 rounded-2xl font-bold text-sm hover:bg-stone-50 transition-all shadow-sm active:scale-95">
                                    Edit Profile
                                </button>
                            )}

                            {/* Dropdown */}
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
                        <Tabs
                            profileData={profileData}
                            isMyProfile={isMyProfile}
                            onReplyClick={handleOpenReplyModal}
                        />
                    </div>
                </motion.section>
            </div>

            {/* Comments Modal */}
            <Modal open={isReplyModalOpen} setOpen={setIsReplyModalOpen}>
                <div className="flex flex-col h-[80vh] max-h-175">

                    <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mb-1">
                            Discussion
                        </h3>
                        <h2 className="text-2xl font-black tracking-tight text-stone-900 leading-none">
                            Responses
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {comments?.length > 0 ? (
                            comments.map((c) => (
                                <div key={c._id} className="flex gap-4 group">
                                    <img
                                        src={c.userId?.pfp || defaultPfp}
                                        className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm"
                                    />
                                    <div className="flex-1">
                                        <div className="bg-stone-100 rounded-2xl rounded-tl-none px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-black text-stone-900">{profileData?.user.firstName} {profileData?.user.lastName}</p>
                                                <span className="text-[9px] text-stone-400 ml-2">{new Date(c.createdAt).toLocaleString()}</span>

                                                {isMyProfile &&
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setSelectedComment(selectedComment === c._id ? null : c._id)}
                                                            className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all active:scale-95"
                                                        >
                                                            <span className="material-symbols-outlined text-2xl">more_horiz</span>
                                                        </button>

                                                        <Dropdown open={selectedComment === c._id} setOpen={setSelectedComment}>
                                                            <div className="p-2 min-w-40">
                                                                <button
                                                                onClick={() => handleUpdateComment}
                                                                className="w-full text-left p-2 text-sm font-bold text-stone-600 hover:bg-stone-50 rounded-lg transition-colors uppercase tracking-wider">
                                                                    Edit Comment
                                                                </button>
                                                                <button className="w-full text-left p-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors uppercase tracking-wider">
                                                                    Delete Comment
                                                                </button>
                                                            </div>
                                                        </Dropdown>
                                                    </div>
                                                }
                                            </div>
                                            <p className="text-sm text-stone-600 mt-1 leading-relaxed">{c.comment}</p>
                                        </div>
                                        <div className="flex gap-4 mt-2 ml-2">
                                            <button className="text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-600 transition-colors">Like</button>
                                            <button className="text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-600 transition-colors">Reply</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center">
                                <p className="text-stone-400 font-serif italic text-sm">No thoughts shared yet. Be the first to break the silence.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white border-t border-stone-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                        <div className="relative flex items-center gap-3 bg-stone-100 rounded-2xl p-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                            <img
                                src={user?.user?.pfp || defaultPfp}
                                className="w-8 h-8 rounded-full object-cover ml-1 shadow-sm"
                            />
                            <textarea
                                ref={commentInputRef}
                                placeholder="Add to the conversation..."
                                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm py-2 resize-none max-h-32 text-stone-800 placeholder-stone-400 font-medium"
                                rows={1}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                            />
                            <button
                                onClick={handlePostComment}
                                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 active:scale-95 transition-all shadow-lg"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal for Cover Selection */}
            <Modal open={isChangeCoverModalOpen} setOpen={setIsChangeCoverModalOpen}>
                <div className="flex flex-col h-[90vh] max-h-225">
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
                                        className={`group relative aspect-video rounded-4xl overflow-hidden cursor-pointer bg-stone-200 border-4
                                            ${selectedBackdrop === banner?.backdropPath ? "border-amber-500/70" : "border-white"}
                                            shadow-xl transition-all hover:shadow-amber-500/20 hover:border-amber-500/40`}
                                        onClick={() => {
                                            setSelectedBackdrop(banner?.backdropPath);
                                        }}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${banner?.backdropPath}`}
                                            alt={banner?.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
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

                    {selectedBackdrop && (
                        <div className="p-6 border-t border-stone-100 bg-white/80 backdrop-blur-md sticky bottom-0 flex justify-end gap-4">
                            <button
                                onClick={() => setIsChangeCoverModalOpen(false)}
                                className="px-6 py-3 bg-stone-200 rounded-xl font-bold hover:bg-stone-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveCover}
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