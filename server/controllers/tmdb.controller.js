import TopRatedMovies from "../models/TopRated.model.js";
import TrendingMovies from "../models/trending.model.js";

// Controller to fetch trending movies
export const getTrendingMovies = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    let trending = await TrendingMovies.findOne({ date: today })
      .populate("movies");

    // fallback if today not available
    if (!trending) {
      trending = await TrendingMovies.findOne()
        .sort({ createdAt: -1 })
        .populate("movies");
    }

    return res.status(200).json(trending?.movies || []);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller to fetch top-rated movies
export const getTopRatedMovies = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    let topRated = await TopRatedMovies.findOne({ date: today })
      .populate("movies");

    // fallback if today not available
    if (!topRated) {
      topRated = await TopRatedMovies.findOne()
        .sort({ createdAt: -1 })
        .populate("movies");
    }

    return res.status(200).json(topRated?.movies || []);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}