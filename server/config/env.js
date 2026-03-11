// // import { config } from 'dotenv';

// // config({ path: `.env.${process.env.NODE_ENV || 'development'}.local`});

// // export const {
// //     PORT,
// //     BASE_URL,
// //     NODE_ENV,
// //     DB_URI,
// //     JWT_SECRET,
// //     JWT_EXPIRES_IN,
// //     TMDB_BASE_URL,
// //     TMDB_KEY
// // } = process.env;

// import { config } from 'dotenv';

// // Choose env file based on NODE_ENV
// let envFile = ".env.development.local"; // default

// if (process.env.NODE_ENV === "production") {
//     envFile = ".env.production.local";
// } else if (process.env.NODE_ENV === "test") {
//     envFile = ".env.test.local";
// }

// config({ path: envFile });

// export const {
//     PORT,
//     BASE_URL,
//     NODE_ENV,
//     DB_URI,
//     JWT_SECRET,
//     JWT_EXPIRES_IN,
//     TMDB_BASE_URL,
//     TMDB_KEY
// } = process.env;


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