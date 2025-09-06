import dotenv from "dotenv";
dotenv.config();

export default {
  APP_PORT: process.env.APP_PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  JWT_SECRET: process.env.JWT_SECRET
};
