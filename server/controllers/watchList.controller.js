import axios from 'axios';
import WatchList from '../models/watchList.model.js';
import History from '../models/history.model.js';
import { getOrCreateMovie } from '../utils/movieUtils.js';

export const getWatchListMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.userId;

    const movie = await WatchList.findOne({ userId, movieId }).populate(
      'movie',
      'title posterPath banner genreNames overview releaseDate'
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found in watchlist"
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getWatchListMovies = async (req, res) => {
  try {
    const userId = req.user.userId;

    const movies = await WatchList.find({ userId })
      .sort({ createdAt: -1 })
      .populate('movie', 'title posterPath banner genreNames overview releaseDate');

    res.status(200).json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const addWatchListMovie = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title } = req.body;

    const existingWatchList = await WatchList.findOne({ userId }).populate('movie');
    if (existingWatchList && existingWatchList.movie.title === title) {
      return res.status(409).json({
        success: false,
        message: 'Movie already exists in watch list'
      });
    }

    const historyExists = await History.findOne({ userId }).populate('movie');
    if (historyExists && historyExists.movie.title === title) {
      return res.status(409).json({
        success: false,
        message: 'Movie already exists in watched list'
      });
    }

    const movieData = await getOrCreateMovie(title);
    if (!movieData) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in TMDb'
      });
    }

    const watchListMovie = await WatchList.create({
      userId,
      movie: movieData._id
    });

    res.status(201).json({
      success: true,
      message: 'Movie added to watchlist',
      data: watchListMovie
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const removeWatchListMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.userId;

    const movie = await WatchList.findOneAndDelete({ movie: movieId, userId });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in watch list'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie removed from watch list',
      data: movie
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};