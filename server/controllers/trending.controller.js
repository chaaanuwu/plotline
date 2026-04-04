import TrendingMovies from "../models/trending.model.js";

export const getTrendingMovies = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    let trending = await TrendingMovies.findOne({ date: today })
      .populate("movies");

    // 🔥 fallback if today not available
    if (!trending) {
      trending = await TrendingMovies.findOne()
        .sort({ createdAt: -1 })
        .populate("movies");
    }

    return res.status(200).json(trending?.movies || []);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};