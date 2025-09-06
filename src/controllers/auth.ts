import { loginSchema, registerSchema } from "../validators/index";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import CustomErrorHandler from "../services/customErrorHandler";
import authservice from "../services/authservice";
import { validateBody } from "../utils/validator";
import authService from "../services/authservice";
import jwt from "../services/jwt";
import { sendResponse } from "../utils/response";
import redisClient from "../config/redis";

const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const registerBody = validateBody(registerSchema, req.body);
      if (!registerBody.success) {
        return next(registerBody.error);
      }

      const { username, email, password } = registerBody.data;

      const exists = await authservice.checkUserAlreadyExists(email);
      if (exists) {
        return next(
          CustomErrorHandler.alreadyExists("Email is already registered")
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await authservice.createUser({
        username: username,
        email: email,
        password: hashedPassword,
      });
      sendResponse(res, "User Signup successfully", newUser, "CREATED");
    } catch (error) {
      return next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginBody = validateBody(loginSchema, req.body);
      if (!loginBody.success) {
        return next(loginBody.error);
      }

      const { email, password } = loginBody.data;
      const exists = await authService.checkUserAlreadyExists(email);
      if (!exists) {
        return next(CustomErrorHandler.notFound("Email is not registered"));
      }

      const user = await authService.getUser(email);
      const match =
        user?.password && (await bcrypt.compare(password, user.password));
      if (!match) {
        return next(CustomErrorHandler.notAuthorized("Incorrect password"));
      }

      const payload = { email, userId: user.id, role: user.role };
      const accessToken = jwt.registerAccessToken(payload);
      const refreshToken = jwt.registerRefreshToken(payload);

      await redisClient.setEx(
        `refresh:${user.id}`,
        10 * 24 * 60 * 60,
        refreshToken
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, //Set to false for localhost (non-HTTPS)
        sameSite: "lax",
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });
      sendResponse(res, "User login successfully", { accessToken }, "SUCCESS");
    } catch (error) {
      return next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return next(CustomErrorHandler.notAuthorized("Refresh token missing"));
      }
      const userData = jwt.verifyToken(refreshToken);

      const storedToken = await redisClient.get(`refresh:${userData.userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        return next(CustomErrorHandler.notAuthorized("Invalid refresh token"));
      }

      const payload = {
        email: userData.email,
        userId: userData.userId,
        role: userData.role,
      };
      const newAccessToken = jwt.registerAccessToken(payload);
      const newRefreshToken = jwt.registerRefreshToken(payload);

      await redisClient.setEx(
        `refresh:${userData.userId}`,
        10 * 24 * 60 * 60,
        refreshToken
      );

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });
      sendResponse(
        res,
        "token refreshed successfully",
        { newAccessToken },
        "CREATED"
      );
    } catch (error) {
      return next(error);
    }
  },
};

export default authController;
