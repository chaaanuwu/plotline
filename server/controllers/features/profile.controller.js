// import { getUserMe } from "../user.controller.js";
// import { getFollowers, getFollowing } from "../user_follows.controller.js";

// export const getUserMeProfile = async (req, res) => {
//     try {
//         const userId = req.user.userId;

//         const [user, followers, following] = await Promise.all([
//             getUserMe(userId),
//             // getFollowers(userId),
//             // getFollowing(userId)
//         ]);

//         res.status(200).json({
//             success: true,
//             user,
//             // followers,
//             // following
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: "Server error"
//         })
//     }
// }

import { getUserMeData } from "../user.controller.js";
import { getFollowersData, getFollowingData } from "../user_follows.controller.js";

export const getUserMeProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [user, followers, following] = await Promise.all([
            getUserMeData(userId),
            getFollowersData(userId),
            getFollowingData(userId)
        ]);

        res.status(200).json({
            success: true,
            user,
            followersCount: followers.length,
            followers,
            followingCount: following.length,
            following
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};