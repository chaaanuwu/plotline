import Movie from "../models/movie.model.js";

export const getMovieById = async (req, res) => {
    const movieId = req.params.id;

    try {
        const movie = await Movie.findById(movieId);

        if(!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({ success: true, movie });

    } catch (error) {
        console.error("Error fetching movie: ", error);
        res.status(500).json({ message: "Failed to fetch movie" });
    }
};