import { useEffect, useState } from "react";
import axios from "axios";

export default function Tabs() {
    const [activeTab, setActiveTab] = useState("reviews");
    const [tabContent, setTabContent] = useState(null);

    useEffect(() => {
        const fetchTabContent = async () => {
            try {
                let fetchRequest = "";

                if (activeTab === "reviews") {
                    fetchRequest = `${import.meta.env.VITE_PLOTLINE_BASE_URL}/reviews`;
                } else if (activeTab === "history") {
                    fetchRequest = `${import.meta.env.VITE_PLOTLINE_BASE_URL}/history`;
                } else if (activeTab === "watchlist") {
                    fetchRequest = `${import.meta.env.VITE_PLOTLINE_BASE_URL}/watchlist`;
                }

                if (!fetchRequest) return;

                const response = await axios.get(fetchRequest, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                setTabContent(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching tab content:", error);
            }
        };

        fetchTabContent();
    }, [activeTab]);

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
                {/* Reviews Tab */}
                {activeTab === "reviews" &&
                    tabContent?.reviews?.map((r) => (
                        <div
                            key={r._id}
                            className="p-4 border rounded-md bg-white shadow-sm"
                        >
                            <p>{r.review}</p>
                            <small className="text-slate-400">
                                Posted on {new Date(r.createdAt).toLocaleDateString()}
                            </small>
                        </div>
                    ))}

                {/* History Tab */}
                {activeTab === "history" &&
                    tabContent?.data?.map((h) => (
                        <div
                            key={h._id}
                            className="p-4 border rounded-md bg-white shadow-sm flex gap-4 items-center"
                        >
                            <img
                                src={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${h.movieId.posterPath}`}
                                alt={h.movieId.title}
                                className="w-16 h-24 object-cover rounded"
                            />
                            <div>
                                <h3 className="font-semibold">{h.movieId.title}</h3>
                                <p className="text-sm text-slate-500">
                                    Released: {new Date(h.movieId.releaseDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-slate-500">
                                    Watched: {new Date(h.watchedAt).toLocaleDateString()}
                                </p>
                                {h.rating && <p>Rating: {h.rating}/10</p>}
                            </div>
                        </div>
                    ))}

                {/* Watchlist Tab */}
                {activeTab === "watchlist" &&
                    tabContent?.data?.map((w) => (
                        <div
                            key={w._id}
                            className="p-4 border rounded-md bg-white shadow-sm flex gap-4 items-center"
                        >
                            <img
                                src={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${w.movieId.posterPath}`}
                                alt={w.movieId.title}
                                className="w-16 h-24 object-cover rounded"
                            />

                            <div>
                                <h3 className="font-semibold">{w.movieId.title}</h3>
                                <p>{w.movieId.overview}</p>
                                <p className="text-sm text-slate-500">
                                    Released: {new Date(w.movieId.releaseDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-slate-500">
                                    Added: {new Date(w.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                        </div>
                    ))}
            </div>
        </div>
    );
}