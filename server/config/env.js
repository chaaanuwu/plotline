import { config } from 'dotenv';
const env = process.env.NODE_ENV || "development";
config({ path: `.env.${env}.local` });

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