import axios from 'axios';

import Movie from '../models/movie.model.js';
import { TMDB_BASE_URL, TMDB_KEY } from '../config/env.js';
import { genreMap } from '../utils/movieGenre.utils.js';

/**
 * Get or create a Movie document from TMDb
 * @param {string} title 
 * @returns Movie document
 */
export const getOrCreateMovie = async (title) => {
    // Check DB
    let movieData = await Movie.findOne({ title });
    if (movieData) return movieData;

    // Only fetch from TMDb if not found
    const tmdbRes = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: { api_key: TMDB_KEY, query: title }
    });

    const results = tmdbRes.data.results;
    if (!results.length) return null;

    const tmdbMovie = results[0];

    movieData = await Movie.create({
        movieId: tmdbMovie.id,
        adult: tmdbMovie.adult,
        backdropPath: tmdbMovie.backdrop_path,
        genreIds: tmdbMovie.genre_ids,
        genreNames: tmdbMovie.genre_ids.map(id => genreMap[id]),
        originalLanguage: tmdbMovie.original_language,
        originalTitle: tmdbMovie.original_title,
        overview: tmdbMovie.overview,
        popularity: tmdbMovie.popularity,
        posterPath: tmdbMovie.poster_path,
        releaseDate: tmdbMovie.release_date,
        title: tmdbMovie.title,
        video: tmdbMovie.video,
        voteAverage: tmdbMovie.vote_average,
        voteCount: tmdbMovie.vote_count
    });

    return movieData;
};