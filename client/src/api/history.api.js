import axiosInstance from "./axiosInstance";

export const getHistory = async (userId) => {
    const url = userId ? `/history/${userId}` : `/history`;
    const res = await axiosInstance.get(url);
    return res.data;
}