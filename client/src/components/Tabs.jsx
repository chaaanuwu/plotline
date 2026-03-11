// import { useEffect, useState } from "react";
// import axios from "axios";
// import ReviewCard from "./ui/ReviewCard";
// import useUserStore from "../store/userStore";

// export default function Tabs() {
//     const [activeTab, setActiveTab] = useState("reviews");
//     const [tabContent, setTabContent] = useState(null);
//     const [profileData, setProfileData] = useState(null);

//     const user = useUserStore((state) => state.user);
//     console.log("Tabs - User from store:", user);
//     console.log("Tabs - Profile data:", profileData);
//     const isMyProfile = user?._id === profileData?.user?._id;
//     console.log("Tabs:", isMyProfile, user, profileData?.user);

//     useEffect(() => {
//         const fetchTabContent = async () => {
//             try {
//                 let fetchRequest = "";

//                 if (activeTab === "reviews") {
//                     fetchRequest = `${import.meta.env.VITE_PLOTLINE_BASE_URL}/reviews`;
//                 } else if (activeTab === "history") {
//                     fetchRequest = `${import.meta.env.VITE_PLOTLINE_BASE_URL}/history`;
//                 } else if (activeTab === "watchlist") {
//                     fetchRequest = `${import.meta.env.VITE_PLOTLINE_BASE_URL}/watchlist`;
//                 }

//                 if (!fetchRequest) return;

//                 const response = await axios.get(fetchRequest, {
//                     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//                 });

//                 setTabContent(response.data);
//                 console.log(response.data);
//             } catch (error) {
//                 console.error("Error fetching tab content:", error);
//             }
//         };

//         fetchTabContent();
//     }, [activeTab]);

//     return (
//         <div>
//             {/* Tab Buttons */}
//             <div className="mt-8 border-b border-slate-200 sticky top-16 bg-background-light/95 backdrop-blur-sm z-40">
//                 <div className="flex gap-8 px-4">
//                     {["reviews", "history", "watchlist"].map((tab) => (
//                         <button
//                             key={tab}
//                             className={`py-4 border-b-2 text-sm font-semibold ${activeTab === tab
//                                 ? "border-primary text-primary"
//                                 : "border-transparent text-slate-500 hover:text-slate-900 transition-colors"
//                                 }`}
//                             onClick={() => setActiveTab(tab)}
//                         >
//                             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Tab Content */}
//             <div className="px-4 mt-4 flex flex-col gap-4">
//                 {/* Reviews Tab */}
//                 {activeTab === "reviews" &&
//                     tabContent?.reviews?.map((r) => (
//                         <div
//                             key={r._id}
//                             className="p-4 border rounded-md bg-white shadow-sm"
//                         >
//                             <img
//                                 src={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${r.movieId.posterPath}`}
//                                 alt={r.movieId.title}
//                                 className="w-16 h-24 object-cover rounded"
//                             />
//                             <p>{r.review}</p>
//                             <small className="text-slate-400">
//                                 Posted on {new Date(r.createdAt).toLocaleDateString()}
//                             </small>
//                             {/* <ReviewCard
//                                 firstName={profileData?.user?.firstName}
//                                 lastName={profileData?.user?.lastName}
//                                 pfp={profileData?.user?.pfp || defaultPfp}
//                                 reviewDate={new Date(r.createdAt).toLocaleDateString()}
//                                 posterUrl={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${r.movieId.posterPath}`}
//                                 backdropUrl={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${r.movieId.backdropPath}`}
//                                 reviewText={r.review}
//                                 rating={r.rating}
//                             /> */}
//                         </div>
//                     ))}

//                 {/* History Tab */}
//                 {activeTab === "history" &&
//                     tabContent?.data?.map((h) => (
//                         <div
//                             key={h._id}
//                             className="p-4 border rounded-md bg-white shadow-sm flex gap-4 items-center"
//                         >
//                             <img
//                                 src={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${h.movieId.posterPath}`}
//                                 alt={h.movieId.title}
//                                 className="w-16 h-24 object-cover rounded"
//                             />
//                             <div>
//                                 <h3 className="font-semibold">{h.movieId.title}</h3>
//                                 <p className="text-sm text-slate-500">
//                                     Released: {new Date(h.movieId.releaseDate).toLocaleDateString()}
//                                 </p>
//                                 <p className="text-sm text-slate-500">
//                                     Watched: {new Date(h.watchedAt).toLocaleDateString()}
//                                 </p>
//                                 {h.rating && <p>Rating: {h.rating}/10</p>}
//                             </div>
//                         </div>
//                     ))}

//                 {/* Watchlist Tab */}
//                 {activeTab === "watchlist" &&
//                     tabContent?.data?.map((w) => (
//                         <div
//                             key={w._id}
//                             className="p-4 border rounded-md bg-white shadow-sm flex gap-4 items-center"
//                         >
//                             <img
//                                 src={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${w.movieId.posterPath}`}
//                                 alt={w.movieId.title}
//                                 className="w-16 h-24 object-cover rounded"
//                             />

//                             <div>
//                                 <h3 className="font-semibold">{w.movieId.title}</h3>
//                                 <p>{w.movieId.overview}</p>
//                                 <p className="text-sm text-slate-500">
//                                     Released: {new Date(w.movieId.releaseDate).toLocaleDateString()}
//                                 </p>
//                                 <p className="text-sm text-slate-500">
//                                     Added: {new Date(w.createdAt).toLocaleDateString()}
//                                 </p>
//                             </div>

//                         </div>
//                     ))}
//             </div>
//         </div>
//     );
// }










import { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "./ui/ReviewCard";
import defaultPfp from "../assets/default-pfp.jpg";

export default function Tabs({ profileData, isMyProfile }) { // ✅ receive as props
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

    return (
        <div>
            {/* Tab Buttons */}
            <div className="mt-8 border-b border-slate-200 sticky top-16 bg-background-light/95 backdrop-blur-sm z-40">
                <div className="flex gap-8 px-4">
                    {["reviews", "history", "watchlist"].map((tab) => (
                        <button
                            key={tab}
                            className={`py-4 border-b-2 text-sm font-semibold ${activeTab === tab
                                ? "border-primary text-primary"
                                : "border-transparent text-slate-500 hover:text-slate-900 transition-colors"
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-4 mt-4 flex flex-col gap-4">
                {activeTab === "reviews" &&
                    tabContent?.reviews?.map((r) => (
                        <ReviewCard
                            key={r._id}
                            firstName={r.user?.firstName}
                            lastName={r.user?.lastName}
                            pfp={r.user?.pfp || defaultPfp}
                            reviewDate={new Date(r.createdAt).toLocaleDateString()}
                            posterUrl={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${r.movieId?.posterPath}`}
                            backdropUrl={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${r.movieId?.backdropPath}`}
                            reviewText={r?.review}
                            rating={r?.rating}
                        />
                    ))}
                {/* You can keep history and watchlist logic same */}
            </div>
        </div>
    );
}