import userFollows from "../models/user_follows.model.js";

export const getFollowers = async (req, res) => {
    try {
        const userId = req.user.userId;

        const followers = await userFollows.find({ followingId: userId }).populate("followerId", "firstName lastName");

        const followersCount = followers.length;

        res.status(200).json({
            success: true,
            followersCount,
            followers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const userId = req.user.userId;
        const following = await userFollows.find({ followerId: userId }).populate("followingId", "firstName lastName");

        const followingCount = following.length;

        res.status(200).json({
            success: true,
            followingCount,
            following
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const followUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { followingId } = req.body;

        if (String(userId) === String(followingId)) {
            return res.status(400).json({
                success: false,
                error: "You cannot follow yourself"
            });
        }

        const existingFollow = await userFollows.findOne({
            followerId: userId,
            followingId
        });

        if (existingFollow) {
            return res.status(400).json({
                success: false,
                error: "You are already following this user"
            });
        }

        /**
         * TODO
         * Check blocked user
         */

        const follower = await userFollows.create({
            followerId: userId,
            followingId
        });

        res.status(200).json({
            success: true,
            follower
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { followingId } = req.body;

        const followRecord = await userFollows.findOneAndDelete({
            followerId: userId,
            followingId
        });

        if (!followRecord) {
            return res.status(400).json({
                success: false,
                error: "You are not following this user"
            });
        }

        res.status(200).json({
            success: true,
            message: "You unfollowed this user"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};