import axios from "axios";
import Movie from "../models/movie.model.js";
import { TMDB_BASE_URL, TMDB_KEY } from "../config/env.js";
import { getOrCreateMovie } from "../services/movie.service.js";

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


/* 
    Helper function to fetch movies from TMDB based on a search query.
*/
const fetchMoviesFromTMDB = async (query) => {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
            api_key: TMDB_KEY,
            query
        }
    });

    return response.data.results;
};

export const searchMovie = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query || query.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Query parameter 'q' is required"
            });
        }

        // Search DB first
        let movies = await Movie.find({
            title: { $regex: query, $options: "i" }
        });

        // If no movies in DB -> fetch from TMDB
        if (movies.length === 0) {
            const tmdbMovies = await fetchMoviesFromTMDB(query);

            for (const tmdbMovie of tmdbMovies) {
                await getOrCreateMovie(tmdbMovie.title);
            }

            // Search again after saving
            movies = await Movie.find({
                title: { $regex: query, $options: "i" }
            });
        }

        return res.status(200).json({
            success: true,
            movies
        });

    } catch (error) {
        console.error("Error searching movie:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to search movie"
        });
    }
};