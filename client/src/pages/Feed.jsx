import { useEffect, useState } from "react";
import { getFeedReviews } from "../api/feed.api";
import ReviewCard from "../components/ui/ReviewCard";
import Loader from "../components/ui/Loader";

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const[loading, setLoading] = useState(true);
    
    const defaultPfp = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await getFeedReviews();
                setFeed(res.data.feed);
            } catch (error) {
                console.error("Error fetching feed: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    const handleReplyClick = (review) => {
        console.log("Reply clicked for: ", review._id);
    };

    if (loading) return <Loader />;

    return (
        /* 
          pt-24 ensures the feed sits nicely below a fixed top navbar. 
          If your navbar is taller or shorter, adjust 'pt-24' (96px) accordingly.
        */
        <div className="min-h-screen bg-stone-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            
            {/* Header - Made wider to match the new card layout */}
            <div className="max-w-4xl mx-auto mb-8 border-b border-stone-200 pb-4">
                <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                    Movie <span className="text-amber-500">Feed</span>
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    See what the community is watching and reviewing.
                </p>
            </div>

            {/* Feed List Container - Bumped up to max-w-4xl for a wider layout */}
            <div className="max-w-4xl mx-auto space-y-6">
                {feed && feed.length > 0 ? (
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
                                reviewDate={r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                                movieTitle={r.movieId?.title}
                                posterUrl={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${r.movieId?.posterPath}`}
                                backdropUrl={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${r.movieId?.backdropPath}`}
                                releaseYear={r.movieId?.releaseDate?.split("-")[0]}
                                genres={r.movieId?.genreNames}
                                reviewText={r?.review}
                                reviewLikes={r?.likedBy}
                                rating={r?.rating}
                                onReplyClick={() => handleReplyClick(r)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-stone-100">
                        <p className="text-stone-400 font-medium">Your feed is looking empty. Follow users to see reviews!</p>
                    </div>
                )}
            </div>
        </div>
    );
}