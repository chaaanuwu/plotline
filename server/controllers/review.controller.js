import Review from '../models/review.model.js';
import History from '../models/history.model.js';

export const getAllMyReviews = async (req, res) => {
    try {
        const userId = req.user.userId;

        const reviews = await Review.find({ userId })
            .populate('movieId', 'title posterPath releaseDate');

        if (reviews.length === 0) {
            res.status(404).json({
                success: false,
                error: "No reviews found"
            });
        }

        res.status(200).json({
            success: true,
            reviews
        });

    } catch (error) {
        console.error('Get my reviews error:', error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const getFilmReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const movieId = req.params;

        const review = Review.findOne({ userId, movieId })
            .populate('movieId', 'title posterPath releaseDate rating');

        if (!review) {
            res.status(404).json({
                success: false,
                error: "Review not found"
            });
        }

        res.status(200).json({
            success: true,
            review
        });

    } catch (error) {
        console.error("Get film review error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const addFilmReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { movieId } = req.params;
        const { review } = req.body;

        const watchedMovie = await History.findOne({ userId, movieId });

        if (!watchedMovie) {
            return res.status(409).json({
                success: false,
                error: "You haven't watched this movie yet"
            });
        }

        const existingReview = await Review.findOne({ userId, movieId });

        if (existingReview) {
            res.status(409).json({
                success: false,
                error: "You already reviewed this movie"
            });
        }

        const movieReview = await Review.create({
            userId,
            movieId,
            review
        });

        res.status(201).json({
            success: true,
            movieReview
        });

    } catch (error) {
        console.error("Add film review error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const updateFilmReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { movieId } = req.params;
        const { review } = req.body;

        const updatedReview = await Review.findOneAndUpdate(
            { userId, movieId },
            { review },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(409).json({
                success: false,
                error: "You haven't reviewed this movie yet"
            });
        }

        let message = "Review updated";

        res.status(200).json({
            success: true,
            message,
            updatedReview
        });

    } catch (error) {
        console.error("Update film review error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const deleteFilmReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { movieId } = req.params;

        const deletedReview = await Review.findOneAndDelete({ userId, movieId });

        if (!deletedReview) {
            return res.status(404).json({
                success: false,
                error: "Review not found"
            });
        }

        let message = "Review deleted successfully"

        res.status(200).json({
            success: true,
            message,
            data: deletedReview
        });

    } catch (error) {
        console.error("Delete review error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};

export const getAllFilmReviews = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movieReviews = await Review.find({ movieId })
            .populate('userId', 'name pfp')
            .sort({ createdAt: -1 });

        if (movieReviews.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No reviews found"
            });
        }

        res.status(200).json({
            success: true,
            movieReviews
        });

    } catch (error) {
        console.error("Get all film reviews error: ", error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
};