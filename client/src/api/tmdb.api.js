import axiosInstance from "./axiosInstance";

export const getTrendingMovies = async () => {
    const res = await axiosInstance.get('/movies/trending');
    return res;
}

export const getTopRatedMovies = async () => {
    const res = await axiosInstance.get('/movies/top-rated');
    return res;
}