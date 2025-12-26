import { Router } from "express";

import {
    getWatchedMovies,
    addWatchedMovie,
    updateWatchedMovie,
    removeWatchedMovie,
    getUserHistory
} from "../controllers/history.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const historyRouter = Router();

historyRouter.get('/', authorize, getWatchedMovies);

historyRouter.get('/:userId', authorize, getUserHistory)

historyRouter.post('/', authorize, addWatchedMovie);

historyRouter.put('/movie/:movieId', authorize, updateWatchedMovie);

historyRouter.delete('/movie/:movieId', authorize, removeWatchedMovie);

export default historyRouter;