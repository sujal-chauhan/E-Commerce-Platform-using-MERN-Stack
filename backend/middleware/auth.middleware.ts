import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        role: string
      };
    }
  }
}

interface JwtPayload {
  _id: string;
  email: string;
  role: string
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //token ko header se get kra
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    // token ko extract kra (format: "Bearer <token>")
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Invalid token format' });
      return;
    }

    // token ko verify kra
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      res.status(500).json({ message: 'JWT secret not configured' });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // user info ko request me attach kra
  
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    res.status(500).json({ message: 'Authentication failed' });
  }
};