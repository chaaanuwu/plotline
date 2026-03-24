import { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "./ui/ReviewCard";
import defaultPfp from "../assets/default-pfp.jpg";

export default function Tabs({ profileData, isMyProfile }) {
    const [activeTab, setActiveTab] = useState("reviews");
    const [tabContent, setTabContent] = useState(null);

    useEffect(() => {
        const fetchTabContent = async () => {
            try {
                if (!profileData) return;

                let fetchRequest;

                if (activeTab === "reviews") {
                    if (isMyProfile) {
                        fetchRequest = `${import.meta.env.VITE_PLOTLINE_BASE_URL}/reviews`;
                    } else {
                        fetchRequest = `${import.meta.env.VITE_PLOTLINE_BASE_URL}/users/${profileData.user._id}/reviews`;
                    }
                } else if (activeTab === "history") {
                    fetchRequest = `${import.meta.env.VITE_PLOTLINE_BASE_URL}/users/${profileData.user._id}/history`;
                } else if (activeTab === "watchlist") {
                    fetchRequest = `${import.meta.env.VITE_PLOTLINE_BASE_URL}/users/${profileData.user._id}/watchlist`;
                }

                if (!fetchRequest) return;

                const response = await axios.get(fetchRequest, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                setTabContent(response.data);

            } catch (error) {
                console.error("Error fetching tab content:", error);
            }
        };

        fetchTabContent();
    }, [activeTab, profileData, isMyProfile]);

    console.log("Profile - Profile data from tabs:", profileData);

    return (
        <div>
            {/* Tab Buttons */}
            <div className="mt-8 border-b border-slate-200 bg-background-light/95 z-40">
                <div className="flex gap-8 px-4">
                    {["reviews", "history", "watchlist"].map((tab) => (
                        <button
                            key={tab}
                            className={`py-4 border-b-2 text-sm font-semibold ${activeTab === tab
                                ? "border-primary text-(--primary-color)"
                                : "border-transparent text-slate-500 hover:text-(--interaction-color) transition-colors"
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-4 mt-4 md:mx-20 flex flex-col gap-4">
                {activeTab === "reviews" &&
                    tabContent?.reviews?.map((r) => (
                        <ReviewCard
                            key={r._id}
                            userId={profileData.user._id}
                            firstName={r.user?.firstName ?? profileData.user.firstName}
                            lastName={r.user?.lastName ?? profileData.user.lastName}
                            pfp={r.user?.pfp ?? profileData.user.pfp ?? defaultPfp}
                            reviewId={r?._id}
                            movieId={r._id}
                            reviewDate={new Date(r.createdAt).toLocaleDateString()}
                            movieTitle={r.movieId?.title}
                            posterUrl={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${r.movieId?.posterPath}`}
                            backdropUrl={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${r.movieId?.backdropPath}`}
                            releaseYear={r.movieId?.releaseDate?.split("-")[0]}
                            genres={r.movieId?.genreNames}
                            reviewText={r?.review}
                            reviewLikes={r?.likedBy}
                            rating={r?.rating}
                        />
                    ))}
            </div>
        </div>
    );
}