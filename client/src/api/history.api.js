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

export const addWatchedMovie = async (title) => {
    const res = await axiosInstance.post('/history', { title });
    return res;
}

export const removeMovieFromHistory = async (movieId) => {
    const res = await axiosInstance.delete(`/history/movie/${movieId}`);
    return res;
}