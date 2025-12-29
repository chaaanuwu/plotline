import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  title: String,
  watchedAt: { type: Date, default: Date.now },
  rating: { type: Number, min: 0, max: 10, default: null },
  review: { type: String, trim: true, default: null }
}, { timestamps: true });

export default mongoose.model("history", historySchema);