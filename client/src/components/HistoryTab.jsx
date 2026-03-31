import { useEffect, useState } from "react";
import { getHistory } from "../api/history.api";
import { useParams } from "react-router-dom";
import MovieCard from "./ui/MovieCard";

export default function HistoryTab() {
    const [historyData, setHistoryData] = useState([]);

    const { userId } = useParams();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getHistory(userId);

                // sort desc
                const sorted = res.data.sort(
                    (a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)
                );

                setHistoryData(sorted);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, [userId]);

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
        <div className="space-y-8 p-4">
            {Object.entries(grouped).map(([date, items]) => (
                <div key={date}>
                    {/*  Date Header */}
                    <h2 className="text-gray-400 text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
                        {date}
                    </h2>

                    {items.map((h) => (
                        <MovieCard
                            key={h._id}
                            title={h.movieId.title}
                            poster={h.movieId.posterPath}
                            rating={h.movieId.rating}
                            releaseYear={h.movieId.releaseDate}
                        />
                    ))}
                    
                </div>
            ))}
        </div>
    );
}