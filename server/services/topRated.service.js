import axios from "axios";
import TopRatedMovies from "../models/TopRated.model.js";
import { TMDB_BASE_URL, TMDB_KEY } from "../config/env.js";
import Movie from "../models/movie.model.js";
import { genreMap } from "../utils/movieGenre.utils.js";

export const fetchAndStoreTopRated = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const existing = await TopRatedMovies.findOne({ date: today });
        if (existing) return;

        const res = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
            params: { api_key: TMDB_KEY }
        });

        const movieFromTMDB = res.data.results;

        // console.log(moviesFromTMDB);

        const movieDocs = [];

        for (const movie of movieFromTMDB) {
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

            movieDocs.push(doc._id);
        }

        await TopRatedMovies.create({
            movies: movieDocs,
            date: today
        });

        console.log("✅ Top rated movies updated");

    } catch (error) {
        console.error("Top rated cron failed: ", error.message);
    }
}