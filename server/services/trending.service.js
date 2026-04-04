import axios from "axios";
import { TMDB_BASE_URL, TMDB_KEY } from "../config/env.js";
import Movie from "../models/movie.model.js";
import TrendingMovies from "../models/trending.model.js";
import { genreMap } from '../utils/movieGenre.utils.js';

export const fetchAndStoreTrending = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const existing = await TrendingMovies.findOne({ date: today });
        if (existing) return;

        const res = await axios.get(`${TMDB_BASE_URL}/trending/movie/day`, {
            params: { api_key: TMDB_KEY }
        });

        const moviesFromTMDB = res.data.results;

        console.log(moviesFromTMDB);

        const moviesDocs = [];

        for (const movie of moviesFromTMDB) {
            const doc = await Movie.findOneAndUpdate(
                { movieId: movie.id },
                {
                    movieId: movie.id,
                    adult: movie.adult,
                    backdropPath: movie.backdrop_path,
                    genreIds: movie.genre_ids,
                    genreNames: movie.genre_ids.map(id => genreMap[id]),
                    originalLanguage: movie.original_language,
                    originalTitle: movie.original_title,
                    overview: movie.overview,
                    popularity: movie.popularity,
                    posterPath: movie.poster_path,
                    releaseDate: movie.release_date,
                    title: movie.title,
                    video: movie.video,
                    voteAverage: movie.vote_average,
                    voteCount: movie.vote_count
                },
                { upsert: true, returnDocument: 'after' }
            );

            moviesDocs.push(doc._id);
        }

        await TrendingMovies.create({
            movies: moviesDocs,
            date: today
        });

        console.log("✅ Trending movies updated");

    } catch (error) {
        console.error("Trending cron failed: ", error.message);
    }
}