import express from "express";
import cors from "cors";
import { testConnection } from "./config/db";
import config from './config/index';
import routes from "./routes";
import { connectRedis } from './config/redis';
import cookieParser from "cookie-parser";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const startServer = async () => {
  try {
    await testConnection();
    await connectRedis();
    app.use("/api", routes);
    
    app.listen(config.APP_PORT, () => {
      console.log(`Server running on port ${config.APP_PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();