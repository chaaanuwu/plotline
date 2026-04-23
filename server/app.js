import express from 'express';
import cors from "cors";

import { BASE_URL } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.route.js';
import errorMiddleware from './middlewares/error.middleware.js';
import historyRouter from './routes/history.route.js';
import watchListRouter from './routes/watchlist.route.js';
import followRouter from './routes/user_follows.route.js';
import reviewRouter from './routes/review.route.js';
import commentRouter from './routes/comment.route.js';
import profileRouter from './routes/features/profile.route.js';
import movieRouter from './routes/movie.route.js';
import tmdbRouter from './routes/tmdb.routes.js';
import shareRouter from './routes/features/generateReviewImage.route.js';
import "./cron/trending.cron.js";
import { fetchAndStoreTrending } from './services/trending.service.js';
import { fetchAndStoreTopRated } from './services/topRated.service.js';

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// Remove this line when deployed, as the cron will handle it
fetchAndStoreTrending().then(() => console.log("🔥 Initial trending fetched"));
fetchAndStoreTopRated().then(() => console.log("🔥 Initial top rated fetched"));

app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}/user`, userRouter);
app.use(`${BASE_URL}/movies`, tmdbRouter);
app.use(`${BASE_URL}/movies`, movieRouter);
app.use(`${BASE_URL}/history`, historyRouter);
app.use(`${BASE_URL}/watchlist`, watchListRouter);
app.use(`${BASE_URL}`, shareRouter);
app.use(`${BASE_URL}`, profileRouter);
app.use(`${BASE_URL}`, commentRouter);
app.use(`${BASE_URL}`, reviewRouter);
app.use(`${BASE_URL}`, followRouter);

app.use(errorMiddleware);

export default app;