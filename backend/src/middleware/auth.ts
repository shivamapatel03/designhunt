import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-change-me";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token." });
  }
};

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ALLOWED_EMAILS = ["shivampatel2330@gmail.com", "shivamsenton@gmail.com"];
  if (
    req.user && 
    req.user.role === "SUPER_ADMIN" && 
    ALLOWED_EMAILS.includes(req.user.email)
  ) {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Super Admin only." });
  }
};
