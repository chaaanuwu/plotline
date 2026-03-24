import { useEffect, useState } from "react";
import ReviewCard from "./ui/ReviewCard";
import defaultPfp from "../assets/default-pfp.jpg";
import { getMyReviews, getUserReviews } from "../api/reviews.api";

export default function Tabs({ profileData, isMyProfile }) {
    const [activeTab, setActiveTab] = useState("reviews");
    const [tabContent, setTabContent] = useState(null);

    useEffect(() => {
        const fetchTabContent = async () => {
            try {
                if (!profileData) return;

                let response;

                if (activeTab === "reviews") {
                    response = isMyProfile
                        ? await getMyReviews()
                        : await getUserReviews(profileData.user._id);

                }
                // else if (activeTab === "history") {
                //     response = await getUserHistory(profileData.user._id);
                // } else if (activeTab === "watchlist") {
                //    response = await getUserWatchlist(profileData.user._id);
                // }

                if (!response) return;

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