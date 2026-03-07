import userFollows from "../models/user_follows.model.js";

export const getFollowersData = async(userId) => {
    try {
        const followers = await userFollows.find({ followingId: userId }).populate("followerId", "firstName lastName pfp");
        return followers;
    } catch (error) {
        console.error("getFollowerData error: ", error);
        throw new Error("Database error while fetching followers.");
    }
};

export const getFollowingData = async (userId) => {
    try {
        return await userFollows.find({ followerId: userId }).populate("followingId", "firstName lastName pfp");
    } catch (error) {
        console.error("getFollowingData error: ", error);
        throw new Error("Database error while fetching following.");
    }
};

export const getFollowers = async (req, res) => {
    try {
        const userId = req.user.userId;

        const followers = await getFollowersData(userId);

        res.status(200).json({
            success: true,
            followers
        });

    } catch (error) {
        console.error("getFollowers controller error:", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const userId = req.user.userId;
        const following = await getFollowingData(userId);

        res.status(200).json({
            success: true,
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
            follower,
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