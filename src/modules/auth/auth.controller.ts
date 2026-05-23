import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";
import type { IUser } from "./auth.interface";

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: message,
      data: error,
    });
  }
};

export const authController = {
  registerUser,
};
