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