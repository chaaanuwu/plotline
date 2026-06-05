import connectToDatabase from "../database/mongodb.js";

export async function ensureDbConnection(req, res, next) {
  // Skip for non-database routes
  const skipPaths = ['/health', '/debug', '/favicon.ico', '/favicon.png'];
  
  if (skipPaths.some(path => req.path.includes(path))) {
    return next();
  }
  
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error(`❌ DB connection failed for ${req.method} ${req.path}:`, error.message);
    res.status(503).json({ 
      error: 'Database connection unavailable',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable'
    });
  }
}