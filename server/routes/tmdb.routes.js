import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { getTrendingMovies } from '../controllers/trending.controller.js';

const tmdbRouter = Router();

tmdbRouter.get('/trending', authorize, getTrendingMovies);

export default tmdbRouter;