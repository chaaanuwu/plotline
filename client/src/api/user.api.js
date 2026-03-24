import axiosInstance from "./axiosInstance";

export const getProfile = async (userId) => {
    const url = userId ? `/user/${userId}` : `/profile/me`;
    const res = await axiosInstance.get(url);
    return res.data;
};