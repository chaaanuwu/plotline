import { motion } from "framer-motion";

export default function MovieCard({
    id,
    title,
    poster,
    rating,
    releaseDate
}) {
    const releaseYear = new Date(releaseDate).getFullYear();

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group w-full cursor-pointer"
        >
            <a href={`/movies/${id}`}>
                {/* Poster Container */}
                <div className="relative aspect-2/3 overflow-hidden rounded-4xl bg-stone-200 shadow-md group-hover:shadow-2xl transition-all duration-500 border border-stone-100">
                    <img
                        src={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${poster}`}
                        alt={`${title} Poster`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        draggable="false"
                        loading="lazy"
                    />

                    {/* Cinematic Vignette Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Rating Badge - Updated to Glassmorphism */}
                    {rating && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-1 shadow-xl">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="#FBBF24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-white text-[10px] font-black">{rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="mt-4 px-1">
                    <h2 className="text-stone-800 text-sm font-black tracking-tight leading-tight line-clamp-1 group-hover:text-amber-600 transition-colors">
                        {title}
                    </h2>
                    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {releaseYear}
                    </p>
                </div>
            </a>
        </motion.div>
    );
}