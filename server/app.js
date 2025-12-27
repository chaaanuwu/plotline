import express from 'express';

import { PORT, BASE_URL } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.route.js';
import errorMiddleware from './middlewares/error.middleware.js';
import historyRouter from './routes/history.route.js';
import watchListRouter from './routes/watchlist.route.js';
import followRouter from './routes/user_follows.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}/user`, userRouter);
app.use(`${BASE_URL}/history`, historyRouter);
app.use(`${BASE_URL}/watchlist`, watchListRouter);
app.use(`${BASE_URL}`, followRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await connectToDatabase();
});

export default app;