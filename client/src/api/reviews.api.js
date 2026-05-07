import axiosInstance from "./axiosInstance";

export const getMyReviews = () => {
    return axiosInstance.get("/reviews");
};

export const getUserReviews = (userId) => {
    return axiosInstance.get(`/users/${userId}/reviews`);
};

export const addMovieReview = (movieId, review) => {
    return axiosInstance.post(`/${movieId}/review`, review);
}

export const toggleLikeReview = (reviewId) => {
    return axiosInstance.patch(`/reviews/${reviewId}`);
};