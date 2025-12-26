import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT,
    BASE_URL,
    NODE_ENV,
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    TMDB_BASE_URL,
    TMDB_KEY
} = process.env;