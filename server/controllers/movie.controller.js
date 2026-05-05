import axios from "axios";
import Movie from "../models/movie.model.js";
import { TMDB_BASE_URL, TMDB_KEY } from "../config/env.js";

export const getMovieById = async (req, res) => {
    const movieId = req.params.id;

    try {
        const movie = await Movie.findById(movieId);

        if(!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({ success: true, movie });

    } catch (error) {
        console.error("Error fetching movie: ", error);
        res.status(500).json({ message: "Failed to fetch movie" });
    }
};

export const searchMovie = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query || query.trim() === "") {
            return res.status(400).json({ success: false, error: "Query parameter 'q' is required" });
        }

        const movies = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                api_key: TMDB_KEY,
                query: query
            }
        });

        res.status(200).json({ success: true, movies: movies.data.results });

    } catch (error) {
        console.error("Error searching movie: ", error);
        res.status(500).json({ message: "Failed to search movie" });
    }
}