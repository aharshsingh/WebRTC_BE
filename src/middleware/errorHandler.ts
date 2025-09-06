import CustomErrorHandler from "../services/customErrorHandler";
import { ZodError } from "zod";
import { Request, Response } from "express";

const errorHandler = (err: Error, req: Request, res: Response): void => {
  let statusCode = 500;
  let data: {
    message: string;
    errors?: ReturnType<ZodError["flatten"]>;
  } = {
    message: "An unexpected error occurred",
  };
  
  if (err instanceof ZodError) {
    statusCode = 422;
    data.message = "Validation failed";
    data.errors = (err as ZodError).flatten();
  }
  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data.message = err.message;
  } else if (err instanceof Error) {
    data.message = err.message;
  }

  res.status(statusCode).json(data);
};

export default errorHandler;
