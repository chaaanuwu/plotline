import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHistory } from "../api/history.api";
import MovieCard from "./ui/MovieCard";

export default function HistoryTab() {
    const [historyData, setHistoryData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const { userId } = useParams();

    const fetchHistory = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const res = await getHistory(userId, page);

            setHistoryData(prev => [...prev, ...res.data]);

            setHasMore(res.hasMore);
            setPage(prev => prev + 1);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 200
            ) {
                fetchHistory();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [page, hasMore, loading]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Group by date
    const grouped = historyData.reduce((acc, item) => {
        const dateKey = formatDate(item.watchedAt);

        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);

        return acc;
    }, {});

    console.log(historyData);

    return (
        <div className="space-y-8 p-2">
            {Object.entries(grouped).map(([date, items]) => (
                <div key={date}>
                    {/* Date Header */}
                    <h2 className="text-gray-400 text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
                        {date}
                    </h2>

                    {/* Movies Row */}
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
        </div>
    );
}