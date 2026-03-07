import Comment from '../models/comment.model.js';

/**
 *  Comments
 */

export const getComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId)
            .populate('userId', 'firstName lastName pfp')
            .populate({
                path: 'replies',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName pfp'
                },
                options: { sort: { createdAt: 1 } }
            });


        if (!comment) {
            return res.status(404).json({
                success: false,
                error: "Comment not found"
            });
        }

        res.status(200).json({
            success: true,
            comment
        });

    } catch (error) {
        console.error("Get comment error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const getAllComments = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const comments = await Comment.find({
            reviewId,
            parentCommentId: null
        })
            .select('-replies')
            .populate('userId', 'firstName lastName pfp')
            .sort({ createdAt: -1 });

        if (comments.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No comments found"
            });
        }

        res.status(200).json({
            success: true,
            comments
        });

    } catch (error) {
        console.error("Get all review comments error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const addReviewComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { reviewId } = req.params;
        const { comment } = req.body;

        let reviewComment = new Comment({
            userId,
            reviewId,
            comment
        });

        reviewComment = await reviewComment.save();
        reviewComment = await reviewComment.populate('userId', 'firstName lastName pfp');

        res.status(201).json({
            success: true,
            reviewComment
        });

    } catch (error) {
        console.error("Add review comment error", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const updateReviewComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { reviewId } = req.params;
        const { comment } = req.body;

        const updatedComment = await Comment.findOneAndUpdate(
            { userId, reviewId },
            { $set: { comment } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            updatedComment
        });

    } catch (error) {
        console.error("Update review comment error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const deleteReviewComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { commentId } = req.params;

        const deletedReviewComment = await Comment.findOneAndDelete({ commentId, userId });

        if (!deletedReviewComment) {
            return res.status(404).json({
                success: false,
                error: "Comment not found"
            });
        }

        res.status(200).json({
            success: true,
            deletedReviewComment
        });

    } catch (error) {
        console.error("Delete review comment error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

/**
 *  Reply comments
 */

export const addReplyComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { commentId } = req.params;
        const { comment } = req.body;

        const replyComment = await Comment.findByIdAndUpdate(
            commentId,
            { $push: { replies: { userId, comment } } },
            { new: true }
        ).populate('replies.userId', 'firstName lastName pfp');

        res.status(201).json({
            success: true,
            replyComment
        });

    } catch (error) {
        console.error("Add reply comment error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const updateReplyComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { replyCommentId } = req.params;
        const { comment } = req.body;

        if (!comment || !comment.trim()) {
            return res.status(400).json({
                success: false,
                message: "Reply comment cannot be empty"
            });
        }

        const updatedComment = await Comment.findOneAndUpdate(
            { "replies._id": replyCommentId, "replies.userId": userId },
            { $set: { "replies.$.comment": comment.trim() } },
            { new: true }
        ).populate("replies.userId", "firstName lastName pfp");

        if (!updatedComment) {
            return res.status(404).json({
                success: false,
                message: "Reply not found"
            });
        }

        res.status(200).json({
            success: true,
            updatedComment
        });

    } catch (error) {
        console.error("Update reply comment error:", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const deleteReplyComment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { replyCommentId } = req.params;

        const deletedReplyComment = await Comment.findByIdAndDelete(
            { "replies._id": replyCommentId, "replies.userId": userId },
            { $pull: { "replies.$.comment": Comment._id } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            deletedReplyComment
        });

    } catch (error) {
        console.error("Delete reply comment error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};