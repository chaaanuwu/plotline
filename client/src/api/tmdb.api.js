import axios from "axios";
import axiosInstance from "./axiosInstance";

export const getTrendingMovies = async () => {
    const res = await axiosInstance.get('/movies/trending');
    return res;
}

export const getTopRatedMovies = async () => {
    const res = await axiosInstance.get('/movies/top-rated');
    return res;
}

export const getLandingImage = async () => {
    const res = await axios.get(`${import.meta.env.VITE_PLOTLINE_BASE_URL}/movies/landing-img`);
    return res;
}