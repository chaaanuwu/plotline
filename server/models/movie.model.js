import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  movieId: { type: Number, required: true, unique: true },
  adult: { type: Boolean, default: false },
  backdropPath: { type: String },
  genreIds: [{ type: Number }],
  genreNames: [{ type: String }],
  originalLanguage: { type: String },
  originalTitle: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  posterPath: { type: String },
  releaseDate: { type: String },
  title: { type: String },
  video: { type: Boolean, default: false },
  voteAverage: { type: Number },
  voteCount: { type: Number },
  lastUpdated: { type: Date, default: Date.now } // track last TMDb update
}, { timestamps: true });

movieSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret.movieId;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;