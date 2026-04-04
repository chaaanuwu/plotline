import axiosInstance from "./axiosInstance";

export const getTrendingMovies = async () => {
    const res = await axiosInstance.get('/movies/trending');
    return res;
}