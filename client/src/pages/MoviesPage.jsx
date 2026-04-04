import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getTrendingMovies } from "../api/tmdb.api";
import MovieCard from "../components/ui/MovieCard";
import Loader from "../components/ui/Loader";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function MoviesPage() {
    const [loading, setLoading] = useState(true);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [featuredMovie, setFeaturedMovie] = useState(null);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await getTrendingMovies();
                const movies = res.data || [];
                setTrendingMovies(movies);

                if (movies.length > 0) {
                    // Pick a random movie for the hero spotlight
                    const randomIndex = Math.floor(Math.random() * movies.length);
                    setFeaturedMovie(movies[randomIndex]);
                }
            } catch (error) {
                console.error("Error fetching trending movies: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-amber-200">

            {/* 1. FEATURED HERO SECTION */}
            <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-stone-900">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ duration: 1.5 }}
                    src={`${import.meta.env.VITE_TMDB_BACKDROP_BASE_URL}${featuredMovie?.backdropPath}`}
                    className="w-full h-full object-cover"
                    alt="Featured backdrop"
                />

                {/* Cinematic Gradient & Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-900/20 to-transparent flex flex-col justify-end px-6 md:px-12 pb-20">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-4">
                            Featured Spotlight
                        </h3>
                        <h1 className="text-4xl md:text-7xl font-black text-stone-900 tracking-tighter mb-4 leading-none">
                            {featuredMovie?.title || featuredMovie?.name}
                        </h1>
                        <p className="text-stone-600 text-sm md:text-lg font-serif italic line-clamp-3 max-w-xl">
                            {featuredMovie?.overview}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* 2. TRENDING SECTION */}
            <main className="px-6 md:px-16 -mt-16 relative z-20 pb-24">
                <MovieSlider
                    title="Trending"
                    subtitle="Global Cinema"
                    movies={trendingMovies}
                />
            </main>
        </div>
    );
}

function MovieSlider({ title, subtitle, movies }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <section className="group relative">
            <div className="flex items-end justify-between mb-8 px-2">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-[2px] w-6 bg-amber-500/40" />
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">{subtitle}</h5>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-stone-900">{title}</h2>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-400 active:scale-95 transition-all shadow-sm"
                    >
                        <ChevronLeftIcon className="size-5 stroke-[2.5]" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-400 active:scale-95 transition-all shadow-sm"
                    >
                        <ChevronRightIcon className="size-5 stroke-[2.5]" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 py-4"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="min-w-[160px] sm:min-w-[200px] md:min-w-[220px] snap-start"
                    >
                        <MovieCard
                            id={movie?._id}
                            title={movie.title || movie.name}
                            poster={movie.posterPath}
                            rating={movie.voteAverage}
                            releaseDate={movie.releaseDate || movie.firstAirDate}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}