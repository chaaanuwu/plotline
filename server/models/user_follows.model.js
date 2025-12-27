import mongoose from "mongoose";

const userFollowsSchema = new mongoose.Schema({
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    followingId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true }
);

export default mongoose.model("userFollows", userFollowsSchema);