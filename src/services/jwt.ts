import config from "../config/index";
import jwtLib, { SignOptions, JwtPayload } from "jsonwebtoken";
import CustomErrorHandler from "./customErrorHandler";

const secret = config.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

const jwt = {
  registerAccessToken(
    payload: JwtPayload,
    expiresIn: SignOptions["expiresIn"] = "15m"
  ) {
    const options: SignOptions = { expiresIn };
    return jwtLib.sign(payload, secret, options);
  },

  registerRefreshToken(
    payload: JwtPayload,
    expiresIn: SignOptions["expiresIn"] = "10d"
  ) {
    const options: SignOptions = { expiresIn };
    return jwtLib.sign(payload, secret, options);
  },

  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwtLib.verify(token, secret) as JwtPayload;
      return decoded;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "TokenExpiredError") {
          throw CustomErrorHandler.notAuthorized("Token has expired");
        } else if (error.name === "JsonWebTokenError") {
          throw CustomErrorHandler.notAuthorized("Invalid token");
        }
      }
      throw CustomErrorHandler.serverError("Token verification failed");
    }
  },
};

export default jwt;
