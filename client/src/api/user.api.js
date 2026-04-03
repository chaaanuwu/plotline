import axiosInstance from "./axiosInstance";

export const getProfile = async (userId) => {
    const url = userId ? `/user/${userId}` : `/profile/me`;
    const res = await axiosInstance.get(url);
    return res.data;
};

export const setProfileCover = async (backdrop) => {
    const res = await axiosInstance.put('/user/me', {
        cover: backdrop
    });

    return res.data;
}