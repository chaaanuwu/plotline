import { Router } from "express";

import {
    getWatchListMovies,
    addWatchListMovie,
    removeWatchListMovie,
    getWatchListMovie
} from "../controllers/watchList.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const watchListRouter = Router();

watchListRouter.get('/', authorize, getWatchListMovies);

watchListRouter.post('/', authorize, addWatchListMovie);

// watchListRouter.get('/movie/:movieId', authorize, getWatchListMovie);

watchListRouter.delete('/movie/:movieId', authorize, removeWatchListMovie);

export default watchListRouter;