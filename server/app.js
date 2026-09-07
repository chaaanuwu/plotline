import express from 'express';
import cors from "cors";

import { BASE_URL } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import feedRouter from './routes/feed.route.js';
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
import { ensureDbConnection } from './middlewares/db.middleware.js';

import { fetchAndStoreTrending } from './services/trending.service.js';
import { fetchAndStoreTopRated } from './services/topRated.service.js';

const app = express();

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === "production"
  ? process.env.CLIENT_URL : "http://localhost:5173";

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint to check DB status
app.get('/debug/db-status', async (req, res) => {
  const mongoose = await import('mongoose');
  res.json({
    connectionState: mongoose.default.connection.readyState,
    stateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.default.connection.readyState],
    hasDbUri: !!process.env.DB_URI,
    nodeEnv: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL
  });
});

// Apply DB connection middleware to all API routes
app.use(`${BASE_URL}`, ensureDbConnection);

// Routes
app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}/feed`, feedRouter);
app.use(`${BASE_URL}/user`, userRouter);
app.use(`${BASE_URL}/movies`, movieRouter);
app.use(`${BASE_URL}/tmdb`, tmdbRouter);
app.use(`${BASE_URL}/history`, historyRouter);
app.use(`${BASE_URL}/watchlist`, watchListRouter);
app.use(`${BASE_URL}`, shareRouter);
app.use(`${BASE_URL}`, profileRouter);
app.use(`${BASE_URL}`, commentRouter);
app.use(`${BASE_URL}`, reviewRouter);
app.use(`${BASE_URL}`, followRouter);

app.use(errorMiddleware);

// Background tasks - ONLY for local development
export const initializeBackgroundTasks = async () => {
  // Skip on Vercel serverless
  if (process.env.VERCEL && process.env.NODE_ENV === "production") {
    console.log("Skipping background tasks on Vercel serverless");
    return;
  }
  
  try {
    await fetchAndStoreTrending();
    console.log("Initial trending fetched");
    
    await fetchAndStoreTopRated();
    console.log("Initial top rated fetched");
  } catch (error) {
    console.error("Failed to run initial data fetches:", error);
  }
};

export default app;