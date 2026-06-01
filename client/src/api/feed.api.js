import axiosInstance from "./axiosInstance"

export const getFeedReviews = async () => {
    const res = await axiosInstance.get('/feed');
    return res;
}