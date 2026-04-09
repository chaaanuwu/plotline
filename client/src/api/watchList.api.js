import axiosInstance from "./axiosInstance"

export const getIsMovieWatchListed = async (movieId) => {
    const res = await axiosInstance.get(`/watchlist/movie/${movieId}`);
    return res.data;
}