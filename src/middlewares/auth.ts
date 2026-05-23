import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import sendResponse from "../utility/sendResponse";
import config from "../config";
import { db } from "../db";
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "You are Unauthorized!",
      });
      return;
    }
    const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;

    const userData = await db.query(`SELECT * FROM users WHERE email = $1`, [
      decoded.email,
    ]);
    const user = userData.rows[0];
    
    if (!user) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Your account does not exist in the database!",
      });
      return;
    }

    req.user = { id: user.id, role: user.role };
   
    next();
  } catch (error) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Invalid or expired token!",
    });
  }
};
