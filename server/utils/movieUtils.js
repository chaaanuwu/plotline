import axios from 'axios';

import Movie from '../models/movie.model.js';
import { TMDB_BASE_URL, TMDB_KEY } from '../config/env.js';

const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

/**
 * Get or create a Movie document from TMDb
 * @param {string} title 
 * @returns Movie document
 */
export const getOrCreateMovie = async (title) => {
  const tmdbRes = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: { api_key: TMDB_KEY, query: title }
  });

  const results = tmdbRes.data.results;
  if (!results.length) return null;

  const tmdbMovie = results[0];

  let movieData = await Movie.findOne({ movieId: tmdbMovie.id });
  if (!movieData) {
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
  }

  return movieData;
};