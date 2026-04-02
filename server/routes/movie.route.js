import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { getMovieById } from "../controllers/movie.controller.js";

const movieRouter = Router();

movieRouter.get('/:id', authorize, getMovieById);

export default movieRouter;