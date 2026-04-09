import axiosInstance from "./axiosInstance"

export const getIsMovieWatchListed = async (movieId) => {
    const res = await axiosInstance.get(`/watchlist/movie/${movieId}`);
    return res.data;
}

export const addMovieToWatchList = async (title) => {
    const res = await axiosInstance.post('/watchlist', { title });
    return res;
}

export const removeMovieFromWatchList = async (movieId) => {
    const res = await axiosInstance.delete(`/watchlist/movie/${movieId}`);
    return res;
}