import type { Response } from 'express';

/**
 * Standard success codes used throughout the application
 */
export type SuccessCode = 'SUCCESS' | 'CREATED' | 'UPDATED' | 'DELETED' | 'ACCEPTED' | 'NO_CONTENT';

/**
 * Maps success codes to HTTP status codes
 */
export function getStatusFromSuccessCode(code: SuccessCode): number {
  switch (code) {
    case 'SUCCESS':
      return 200;
    case 'CREATED':
      return 201;
    case 'UPDATED':
      return 200;
    case 'DELETED':
      return 200;
    case 'ACCEPTED':
      return 202;
    case 'NO_CONTENT':
      return 204;
    default:
      return 200;
  }
}

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  code: SuccessCode;
  message: string;
  result: T;
}

/**
 * Type-safe response helper that automatically handles code and message
 * while allowing handlers to only define the result type
 */
export function sendResponse<T>(res: Response, message: string, result: T, code: SuccessCode = 'SUCCESS'): void {
  const statusCode = getStatusFromSuccessCode(code);

  const response: ApiResponse<T> = {
    code,
    message,
    result
  };

  res.status(statusCode).json(response);
}

/**
 * Convenience functions for common response types
 */
export const ResponseHelpers = {
  /**
   * Send a successful response (200)
   */
  success: <T>(res: Response, message: string, result: T) => sendResponse(res, message, result, 'SUCCESS'),

  /**
   * Send a created response (201)
   */
  created: <T>(res: Response, message: string, result: T) => sendResponse(res, message, result, 'CREATED'),

  /**
   * Send an updated response (200)
   */
  updated: <T>(res: Response, message: string, result: T) => sendResponse(res, message, result, 'UPDATED'),

  /**
   * Send a deleted response (200)
   */
  deleted: <T>(res: Response, message: string, result: T) => sendResponse(res, message, result, 'DELETED'),

  /**
   * Send an accepted response (202)
   */
  accepted: <T>(res: Response, message: string, result: T) => sendResponse(res, message, result, 'ACCEPTED'),

  /**
   * Send a no content response (204)
   */
  noContent: (res: Response, message: string) => sendResponse(res, message, null, 'NO_CONTENT')
};