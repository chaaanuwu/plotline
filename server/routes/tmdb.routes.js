import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { getLandingImg, getTopRatedMovies, getTrendingMovies } from '../controllers/tmdb.controller.js';

const tmdbRouter = Router();

tmdbRouter.get('/trending', authorize, getTrendingMovies);

tmdbRouter.get('/top-rated', authorize, getTopRatedMovies);

tmdbRouter.get('/landing-img', getLandingImg);

export default tmdbRouter;