import axios from "axios";
import axiosInstance from "./axiosInstance";

export const getHistory = async (userId) => {
    const url = userId ? `/history/${userId}` : `/history`;
    const res = await axiosInstance.get(url);
    return res.data;
}

export const getMovieHistory = async (movieId) => {
    const res = await axiosInstance.get(`/history/movie/${movieId}`);
    return res.data;
}

export const getHistoryBanner = async () => {
    const res = await axiosInstance.get('/history');
    return res.data;
}