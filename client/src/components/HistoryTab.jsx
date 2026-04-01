import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getHistory } from "../api/history.api";
import MovieCard from "./ui/MovieCard";

export default function HistoryTab() {
    const [historyData, setHistoryData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();

    const loadingRef = useRef(false);
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);

    const fetchHistory = async (currentPage) => {
        if (loadingRef.current || !hasMoreRef.current) return;

        loadingRef.current = true;
        setLoading(true);

        try {
            const res = await getHistory(userId, currentPage);

            setHistoryData(prev => [...prev, ...res.data]);
            setHasMore(res.hasMore);
            hasMoreRef.current = res.hasMore;

            setPage(prev => prev + 1);
            pageRef.current = currentPage + 1;

        } catch (error) {
            console.error(error);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    // Load first page on mount
    useEffect(() => {
        fetchHistory(1);
    }, [userId]);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 200
            ) {
                fetchHistory(pageRef.current);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const grouped = historyData.reduce((acc, item) => {
        const dateKey = formatDate(item.watchedAt);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
    }, {});

    return (
        <div className="space-y-8 p-2 min-h-screen">
            {Object.entries(grouped).map(([date, items]) => (
                <div key={date}>
                    <h2 className="text-gray-400 text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
                        {date}
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {items.map((h) => (
                            <MovieCard
                                key={h._id}
                                title={h.movieId.title}
                                poster={h.movieId.posterPath}
                                rating={h.movieId.rating}
                                releaseDate={h.movieId.releaseDate}
                            />
                        ))}
                    </div>
                </div>
            ))}
            {loading && <p>Loading...</p>}
        </div>
    );
}