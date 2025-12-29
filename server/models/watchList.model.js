import mongoose from "mongoose";

const watchListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: {  type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  title: String
}, { timestamps: true });

export default mongoose.model("watchList", watchListSchema);