import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import bbBg from "../assets/bb-bg.jpg";
import defaultPfp from "../assets/default-pfp.jpg";
import CustomButton from "../components/ui/CustomButton";
import Tabs from "../components/Tabs";
import useUserStore from "../store/userStore";
import Navbar from "../components/Navbar";
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

    if (!profileData) return <p>Loading profile...</p>;

    const isMyProfile = user?.user?._id === profileData?.user?._id;

    console.log(user);
    console.log(profileData);

    console.log("Profile - User from store:", user);
    console.log("Profile - Profile data:", profileData);
    console.log("Profile:", isMyProfile, user, profileData.user);

    return (
        <>
            <Navbar />

            <main className="max-w-5xl mx-auto pb-20">
                <div className="relative">
                    <div className="relative h-48 md:h-80 w-full overflow-hidden rounded-xl">
                        <img
                            src={bbBg}
                            alt="Cover"
                            className="w-full h-full object-cover"
                            draggable="false"
                        />

                        <CustomButton
                            className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/50 text-white border border-white rounded-lg hover:shadow-lg transition text-sm"
                        >
                            Change Cover
                        </CustomButton>
                    </div>

                    <div className="px-4 -mt-16 md:-mt-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden shadow-xl">
                                <img
                                    src={profileData.user.pfp || defaultPfp}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    draggable="false"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 items-start md:items-center">
                            {!isMyProfile && (
                                <CustomButton
                                    onClick={() => console.log("Follow clicked")}
                                    className="bg-(--primary-color) text-white px-4 py-2 rounded-full hover:bg-(--interaction-color) hover:shadow-lg transition text-sm sm:text-base flex-1 sm:flex-auto min-w-30 text-center"
                                >
                                    Follow
                                </CustomButton>
                            )}

                            <CustomButton
                                onClick={() => console.log("More clicked")}
                                className="w-10 h-10 flex items-center justify-center bg-[#F8FAFC] text-(--primary-text) border-2 border-(--border-color) rounded-full hover:border-(--primary-color) hover:shadow-lg transition"
                            >
                                <span className="material-symbols-outlined text-lg sm:text-xl">more_horiz</span>
                            </CustomButton>
                        </div>
                    </div>

                    <div className="px-4 mt-4">
                        <div className="flex items-center gap-1.5">
                            <h2 className="text-2xl md:text-3xl font-bold">
                                {profileData.user.firstName} {profileData.user.lastName}
                            </h2>
                        </div>

                        <p
                            className="mt-4 max-w-2xl leading-relaxed"
                            style={{ color: "var(--secondary-text-color)" }}
                        >
                            {profileData.user.about || ""}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-slate-500">
                            {profileData.user.createdAt && (
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                                    <span>
                                        Joined {new Date(profileData.user.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long'
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-4 mt-8 flex gap-8 md:gap-12">
                        <a href="/followers">
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-slate-700 text-center">{user.followersCount || 0}</span>
                                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Followers</span>
                            </div>
                        </a>

                        <a href="/following">
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-slate-700 text-center">{user.followingCount || 0}</span>
                                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Following</span>
                            </div>
                        </a>
                    </div>

                    <Tabs profileData={profileData} isMyProfile={isMyProfile} />
                </div>
            </main>
        </>
    );
}