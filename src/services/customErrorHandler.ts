class CustomErrorHandler extends Error {
  status: number;
  
  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
    this.message = msg;
  }

  static alreadyExists(message: string = "Resource already exists") {
    return new CustomErrorHandler(409, message);
  }

  static notFound(message: string = "Resource not found") {
    return new CustomErrorHandler(404, message);
  }

  static notAuthorized(message: string = "Access denied - insufficient permissions") {
    return new CustomErrorHandler(401, message);
  }

  static forbidden(message: string = "Forbidden - you don't have permission to access this resource") {
    return new CustomErrorHandler(403, message);
  }

  static badRequest(message: string = "Invalid request data") {
    return new CustomErrorHandler(400, message);
  }

  static serverError(message: string = "Internal server error occurred") {
    return new CustomErrorHandler(500, message);
  }

  static validationError(message: string = "Validation failed") {
    return new CustomErrorHandler(422, message);
  }
}

export default CustomErrorHandler;