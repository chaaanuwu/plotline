import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { getMovieById, searchMovie } from "../controllers/movie.controller.js";

const movieRouter = Router();

movieRouter.get('/search', authorize, searchMovie);

movieRouter.get('/:id', authorize, getMovieById);

export default movieRouter;