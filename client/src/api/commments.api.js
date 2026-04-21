import axiosInstance from "./axiosInstance"

export const getAllComments = async (reviewId) => {
    const res = await axiosInstance.get(`/${reviewId}/comments`);
    return res.data;
};

export const postComment = async (reviewId, comment) => {
    const res = axiosInstance.post(`/${reviewId}/comments`, {
        comment: comment
    });
    return res;
};

export const deleteComment = async (commentId) => {
    const res = axiosInstance.delete(`/comments/${commentId}`);
    return res;
}