import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js';
import { followUser, getFollowers, getFollowing, unfollowUser } from '../controllers/user_follows.controller.js';

const followRouter = Router();

followRouter.get('/me/followers', authorize, getFollowers);

followRouter.get('/me/following', authorize, getFollowing);

followRouter.post('/me/follow', authorize, followUser);

followRouter.post('/me/unfollow', authorize, unfollowUser);

export default followRouter;