import axiosInstance from "./axiosInstance";

export const getMyReviews = () => {
    return axiosInstance.get("/reviews");
};

export const getUserReviews = (userId) => {
    return axiosInstance.get(`/users/${userId}/reviews`);
};

export const toggleLikeReview = (reviewId) => {
    return axiosInstance.patch(`/reviews/${reviewId}`);
};