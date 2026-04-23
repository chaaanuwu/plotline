import generateReviewImage from '../../utils/generateReviewImage.util.js';
import Review from '../../models/review.model.js';
import History from '../../models/history.model.js';
import { CLIENT_URL, TMDB_BACKDROP_BASE_URL, TMDB_POSTER_BASE_URL } from '../../config/env.js';

export const shareReviewImage = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const clientURL = CLIENT_URL;

        const review = await Review.findById(reviewId)
            .populate('movieId', '_id title posterPath backdropPath releaseDate genreNames')
            .populate('userId', '_id firstName lastName pfp');

        if (!review) {
            return res.status(404).json({
                success: false,
                error: "Review not found"
            });
        }

        const history = await History.findOne({ userId: review.userId._id, movieId: review.movieId._id });

        const reviewLink = `${clientURL}/reviews/${reviewId}`;

        const imageBuffer = await generateReviewImage({
            backdropUrl: TMDB_BACKDROP_BASE_URL + review.movieId.backdropPath,
            posterUrl: TMDB_POSTER_BASE_URL + review.movieId.posterPath,
            title: review.movieId.title,
            genres: review.movieId.genreNames,
            year: review.movieId.releaseDate ? review.movieId.releaseDate.split("-")[0] : "N/A",
            reviewText: review.review,
            likeCount: review.likedBy.length.toString(),
            username: review.userId.firstName + " " + review.userId.lastName,
            userAvatarUrl: review.userId.pfp,
            rating: history.rating ? history.rating.toString() : "0",
            reviewDate: review.createdAt.toDateString().split(" ").slice(1, 3).join(" ") + ", " + review.createdAt.getFullYear(),
            linkToReview: reviewLink
        });

        res.set('Content-Type', 'image/png');
        res.set(`Content-Disposition`, `attachment; filename="${reviewId}.png"`);
        res.send(imageBuffer);

    } catch (error) {
        console.error("Share review image error:", error);

        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}