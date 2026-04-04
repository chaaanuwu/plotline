import { useEffect } from "react";
import { getTrendingMovies } from "../api/tmdb.api";

export default function TmdbMovie() {
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await getTrendingMovies();
                console.log("Trending movies: ", res.data);
            } catch (error) {
                console.error("Error fetching trending movies: ", error);
            }
        }
        fetchTrending();
    }, []);

    return (
        <></>
    );
}