import Review from "../models/review.model.js";
import userFollows from "../models/user_follows.model.js";

export const getFeed = async (req, res) => {
    try {
        const userId = req.user.userId;

        const followingIds = await userFollows
            .find({ followerId: userId })
            .select("followingId");

        const followingUserIds = followingIds.map(f => f.followingId);

        let feed = await Review.find({
            userId: { $in: followingUserIds }
        })
            .populate("userId", "firstName lastName pfp")
            .populate("movieId", "_id title posterPath backdropPath releaseDate genreNames")
            .sort({ createdAt: -1 })
            .limit(20);

        // recommendations
        if (feed.length < 20) {

            const feedIds = feed.map(post => post._id);

            const recommended = await Review.find({
                _id: { $nin: feedIds },
                userId: { $ne: userId } // not own posts
            })
                .populate("userId", "firstName lastName pfp")
                .populate("movieId", "_id title posterPath backdropPath releaseDate genreNames")
                .sort({ likesCount: -1, createdAt: -1 }) // trending
                .limit(20 - feed.length);

            feed = [...feed, ...recommended];
        }

        res.status(200).json({
            success: true,
            feed
        });

    } catch (error) {
        console.error("Get feed error:", error);

        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};