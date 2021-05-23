import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

const JWTSecret = process.env.JWT_SECRET || 'localSecret';

export type DecodedToken = { userId: number; iat: number; exp: number };

const isAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const { accessToken } = request.cookies;

  try {
    const decodedToken = jsonwebtoken.verify(accessToken, JWTSecret);

    if (!decodedToken) {
      return response.status(401).send();
    }

    response.locals.userId = (<DecodedToken>decodedToken).userId;

    return next();
  } catch (error) {
    return response.status(401).send();
  }
};

export default isAuthenticated;
