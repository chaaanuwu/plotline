import mongoose from "mongoose";

const trendingMoviesSchema = new mongoose.Schema({
  movies: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Movie" }
  ],
  date: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model("TrendingMovies", trendingMoviesSchema);