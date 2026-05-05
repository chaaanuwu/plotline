import axiosInstance from "./axiosInstance";

export const getMovieById = async (id) => {
    try {
        const response = await axiosInstance.get(`/movies/${id}`);
        return response.data.movie;
    } catch (error) {
        console.error("Error fetching movie: ", error);
        throw error;
    }
}

export const searchMovies = async (title) => {
    try {
        const response = await axiosInstance.get(`/movies/search?q=${title}`);
        return response;
    } catch (error) {
        console.error("Error searching movie: ", error);
        throw error;
    }
}