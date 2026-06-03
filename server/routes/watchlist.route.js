import { Router } from "express";

import {
    getWatchListMovies,
    addWatchListMovie,
    removeWatchListMovie,
    getWatchListMovie,
    isMovieWatchListed,
    getPublicWatchListMovies
} from "../controllers/watchList.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const watchListRouter = Router();

watchListRouter.get('/', authorize, getWatchListMovies);

watchListRouter.get('/:userId', authorize, getPublicWatchListMovies);

watchListRouter.get('/movie/:movieId', authorize, isMovieWatchListed);

watchListRouter.post('/', authorize, addWatchListMovie);

watchListRouter.delete('/movie/:movieId', authorize, removeWatchListMovie);

export default watchListRouter;