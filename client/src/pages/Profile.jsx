import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import bbBg from "../assets/bb-bg.jpg";
import defaultPfp from "../assets/default-pfp.jpg";
import CustomButton from "../components/ui/CustomButton";
import Tabs from "../components/Tabs";
import useUserStore from "../store/userStore";
import { getProfile } from "../api/user.api";

export default function Profile() {
    const [profileData, setProfileData] = useState(null);
    const user = useUserStore((state) => state.user);
    const { userId } = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile(userId);
                setProfileData(data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };

        fetchProfile();
    }, [userId]);

    if (!profileData) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin" />
                    <p className="text-stone-400 font-medium animate-pulse">Loading profile...</p>
                </div>
            </div>
        );
    }

    const isMyProfile = user?.user?._id === profileData?.user?._id;

    return (
        <main className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-amber-100">

            <div className="relative h-64 md:h-96 w-full bg-stone-200 overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    src={bbBg}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    draggable="false"
                />

                <div className="absolute inset-0 bg-linear-to-t from-stone-50 via-transparent to-black/20" />
                
                {isMyProfile && (
                    <button className="absolute bottom-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95">
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
                        <Tabs profileData={profileData} isMyProfile={isMyProfile} />
                    </div>
                </motion.section>

            </div>
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