export default function MovieCard({
    title,
    poster,
    rating,
    releaseYear
}) {
    return (
        <>
            <div className="w-48 group cursor-pointer">
                {/* Poster */}
                <div className="w-48 aspect-2/3 relative overflow-hidden rounded-xl shadow-lg">
                    <img
                        src={`${import.meta.env.VITE_TMDB_POSTER_BASE_URL}${poster}`}
                        alt={`${title} Poster`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        draggable="false"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-90"></div>

                    {/* Rating */}
                    {rating && (
                        < div className="absolute top-2 right-2 flex items-center gap-1 bg-(--primary-color) backdrop-blur-sm rounded-3xl px-4 py-1">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="#FBBF24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-white text-xs font-bold">{rating}</span>
                        </div>
                    )}

                </div>

                <div className="mt-3">
                    <a href="">
                        <h2 className="text-slate-700 text-lg font-semibold leading-tight line-clamp-1">
                            {title}
                        </h2>
                    </a>
                    <p className="text-slate-400 text-sm mt-1">{releaseYear}</p>
                </div>
            </div>
        </>
    );
}