import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, trim: true, required: true },
    replies: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        repliedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;