import axiosInstance from "./axiosInstance";

export const shareReview = async (reviewId) => {
    try {
        const res = await axiosInstance.get(`/reviews/${reviewId}/share`);
        return res;
    } catch (error) {
        console.error("Error sharing review: ", error);
        throw error;
    }
}