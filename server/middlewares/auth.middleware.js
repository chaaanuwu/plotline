import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';

const authorize = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    // Find the user in DB
    const user = await User.findById(decoded.userId).select('_id name email');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
    }

    // Attach userId to req.user
    req.user = { userId: user._id, name: user.name, email: user.email };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized', error: error.message });
  }
};

export default authorize;