import axios from "axios";
import axiosInstance from "./axiosInstance";

export const getTrendingMovies = async () => {
    const res = await axiosInstance.get('/tmdb/trending');
    return res;
}

export const getTopRatedMovies = async () => {
    const res = await axiosInstance.get('/tmdb/top-rated');
    return res;
}

export const getLandingImage = async () => {
    const res = await axios.get(`${import.meta.env.VITE_PLOTLINE_BASE_URL}/tmdb/landing-img`);
    return res;
}