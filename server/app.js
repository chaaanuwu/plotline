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

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // allow your React frontend
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true // if you’re sending cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}/user`, userRouter);
app.use(`${BASE_URL}/history`, historyRouter);
app.use(`${BASE_URL}/watchlist`, watchListRouter);
app.use(`${BASE_URL}`, profileRouter);
app.use(`${BASE_URL}`, commentRouter);
app.use(`${BASE_URL}`, reviewRouter);
app.use(`${BASE_URL}`, followRouter);

app.use(errorMiddleware);

export default app;