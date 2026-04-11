import axiosInstance from "./axiosInstance";

export const followUser = async (followingId) => {
    const res = await axiosInstance.post('/me/follow', { followingId });
    return res;
}