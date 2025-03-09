import express, { Request, Response, NextFunction } from 'express'
import Logger from '../internal/Logger.js'

/**
 * Enum for HTTP Methods
 */
enum EHttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

const SafeRouter = {
  router: express.Router(),

  GET: (path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<Response>) => {
    RegisterSafeRoute(EHttpMethod.GET, path, handler)
  },

  POST: (path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<Response>) => {
    RegisterSafeRoute(EHttpMethod.POST, path, handler)
  },

  PUT: (path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<Response>) => {
    RegisterSafeRoute(EHttpMethod.PUT, path, handler)
  },

  DELETE: (path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<Response>) => {
    RegisterSafeRoute(EHttpMethod.DELETE, path, handler)
  }
}

/**
 * SafeRouter wrapper to simplify route creation with automatic error handling.
 * @param method - The HTTP method from HttpMethod enum.
 * @param path - The API route path.
 * @param handler - The async function handling the request.
 */
const RegisterSafeRoute = function(
  method: EHttpMethod,
  path: string,
  handler: (req: Request, res: Response, next: NextFunction) => Promise<Response>
) {
  const asyncHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return handler(req, res, next)
    } catch (error) {
      Logger(req).exception(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  SafeRouter.router[method](path, asyncHandler)
}

export default SafeRouter