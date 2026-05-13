import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "designhunt_secret_key_123";

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

export const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  console.log("Auth Middleware: token present =", !!token);

  if (!token) {
    console.log("Auth Middleware: No token, returning 401");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.userId = payload.userId || payload.id;
    console.log("Auth Middleware: token verified, userId =", req.userId);
    next();
  } catch (error) {
    console.log("Auth Middleware: Token verification failed");
    res.status(401).json({ error: "Invalid token" });
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
