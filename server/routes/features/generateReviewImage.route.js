import { Router } from "express";

import authorize from "../../middlewares/auth.middleware.js";
import { shareReviewImage } from "../../controllers/features/generateReviewImage.controller.js";

const shareRouter = Router();

shareRouter.get('/reviews/:reviewId/share', authorize, shareReviewImage);

export default shareRouter;