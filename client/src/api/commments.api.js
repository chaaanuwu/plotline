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

export const updateComment = async (reviewId, commentId, updatedComment) => {
    const res = axiosInstance.patch(`/${reviewId}/comments/${commentId}`, {
        comment: updatedComment
    });
    return res;
};

export const deleteComment = async (reviewId, commentId) => {
    const res = axiosInstance.delete(`/${reviewId}/comments/${commentId}`);
    return res;
};