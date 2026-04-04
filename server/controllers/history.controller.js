import mongoose from "mongoose";
import History from "../models/history.model.js";
import WatchList from "../models/watchList.model.js";
import { getOrCreateMovie } from "../services/movie.service.js";

/**
 * Get current user's watched movies
 */
export const getWatchedMovies = async (req, res) => {
  try {
    const userId = req.user.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const movies = await History.find({ userId })
      .sort({ watchedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("movieId", "movieId title posterPath backdropPath releaseDate");

    const total = await History.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: movies,
      hasMore: skip + movies.length < total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};


/**
 * Add a movie to watched list
 */
export const addWatchedMovie = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, rating = null } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const movieData = await getOrCreateMovie(title);

    if (!movieData) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    // Prevent duplicates
    const historyExists = await History.findOne({
      userId,
      movieId: movieData._id
    });

    if (historyExists) {
      return res.status(409).json({
        success: false,
        message: "Movie already exists in watched list"
      });
    }

    const watchedMovie = await History.create({
      userId,
      movieId: movieData._id,
      rating,
      watchedAt: new Date()
    });

    // Remove from watchlist if exists
    await WatchList.deleteOne({
      userId,
      movieId: movieData._id
    });

    res.status(201).json({
      success: true,
      message: "Movie added to watched list",
      data: watchedMovie
    });

  } catch (error) {
    console.error("Add watched movie error:", error);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};


/**
 * Update rating of a watched movie
 */
export const updateWatchedMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating } = req.body;
    const userId = req.user.userId;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID"
      });
    }

    if (rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update"
      });
    }

    const updatedMovie = await History.findOneAndUpdate(
      { _id: movieId, userId },
      { $set: { rating } },
      { new: true, runValidators: true }
    ).populate("movieId", "movieId title posterPath releaseDate");

    if (!updatedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found in watched list"
      });
    }

    res.status(200).json({
      success: true,
      message: "Rating updated",
      data: updatedMovie
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


/**
 * Remove a watched movie
 */
export const removeWatchedMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.isValidObjectId(movieId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID"
      });
    }

    const deletedMovie = await History.findOneAndDelete({
      _id: movieId,
      userId
    }).populate("movieId", "title");

    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found in watched list"
      });
    }

    res.status(200).json({
      success: true,
      message: `${deletedMovie.movieId.title} removed from watched list`,
      data: deletedMovie
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

























// /**
//  * Remove a watched movie
//  */
// export const removeWatchedMovie = async (req, res) => {
//   try {
//     const { movieId } = req.params;
//     const userId = req.user.userId;

//     const movie = await History.findOneAndDelete({ movieId, userId });
//     if (!movie) {
//       return res.status(404).json({ success: false, message: 'Movie not found in watched list' });
//     }

//     res.status(200).json({ success: true, message: `${movie.title} removed from watched list`, data: movie });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Server error' });
//   }
// };

/**
 * Get another user's watched movies (public)
 */
export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const movies = await History.find({ userId })
      .sort({ watchedAt: -1 })
      .populate('movieId', 'title posterPath banner overview releaseDate');

    if (!movies.length) {
      return res.status(404).json({ success: false, message: 'No history found for this user' });
    }

    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};