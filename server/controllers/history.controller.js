import axios from 'axios';

import History from '../models/history.model.js';
import WatchList from '../models/watchList.model.js';
import { getOrCreateMovie } from '../utils/movieUtils.js';
import { TMDB_BASE_URL, TMDB_KEY } from '../config/env.js';

/**
 * Get current user's watched movies
 */
export const getWatchedMovies = async (req, res) => {
  try {
    const userId = req.user.userId;

    const movies = await History.find({ userId })
      .sort({ watchedAt: -1 })
      .populate('movieId', 'title posterPath releaseDate');

    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Add a movie to watched list
 */
export const addWatchedMovie = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, rating = null, review = null } = req.body;

    const tmdbRes = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: { api_key: TMDB_KEY, query: title }
    });

    const results = tmdbRes.data.results;
    if (!results.length) {
      return res.status(404).json({ success: false, message: 'Movie not found in TMDb' });
    }

    const tmdbMovie = results[0];

    const movieData = await getOrCreateMovie(title);

    if (!movieData) return res.status(404).json({ success: false, message: 'Movie not found in TMDb' });

    const historyExists = await History.findOne({ userId, movieId: tmdbMovie.id });
    if (historyExists) {
      return res.status(409).json({ success: false, message: 'Movie already exists in watched list' });
    }

    const watchedMovie = await History.create({
      userId,
      movieId: tmdbMovie.id,
      rating,
      review,
      movie: movieData._id
    });

    await WatchList.deleteOne({ userId, movieId: tmdbMovie.id });

    res.status(201).json({ success: true, message: 'Movie added to watched list', data: watchedMovie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Update rating or review of a watched movie
 */
export const updateWatchedMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.userId;

    if (rating === undefined && review === undefined) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }

    const movie = await History.findOneAndUpdate(
      { movieId, userId },
      { $set: { rating, review } },
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found in watched list' });
    }

    let message = 'Movie updated';
    if (rating !== undefined && review !== undefined) message = 'Rating and review updated';
    else if (rating !== undefined) message = 'Rating updated';
    else if (review !== undefined) message = 'Review updated';

    res.status(200).json({ success: true, message, data: movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Remove a watched movie
 */
export const removeWatchedMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.userId;

    const movie = await History.findOneAndDelete({ movieId, userId });
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found in watched list' });
    }

    res.status(200).json({ success: true, message: `${movie.title} removed from watched list`, data: movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Get another user's watched movies (public)
 */
export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const movies = await History.find({ userId })
      .sort({ watchedAt: -1 })
      .populate('movie', 'title posterPath banner overview releaseDate');

    if (!movies.length) {
      return res.status(404).json({ success: false, message: 'No history found for this user' });
    }

    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};