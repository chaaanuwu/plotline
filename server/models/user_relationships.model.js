import mongoose from "mongoose";

const userRelationshipSchema = new mongoose.Schema({
    sourceUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ['follow', 'block'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true }
);

export default mongoose.model("userRelationship", userRelationshipSchema);